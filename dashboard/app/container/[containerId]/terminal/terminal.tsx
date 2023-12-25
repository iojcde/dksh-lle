"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as xterm from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";
import { WebglAddon } from "xterm-addon-webgl";

import ReconnectingWebSocket from "@/reconnecting-websocket";

export interface _Terminal extends xterm.Terminal {
  _core: {
    buffer: {
      x: number;
    };
  };
}

const webgl = new WebglAddon();
const fitAddon = new FitAddon();

export default function Terminal({ containerId }: { containerId: string }) {
  const termDivRef = React.useRef<HTMLDivElement>(null);
  const termRef = React.useRef<_Terminal>();
  const sizeRef = React.useRef({ cols: 0, rows: 0 });

  const wsRef = useRef<ReconnectingWebSocket>();

  const loadTerminal = () => {
    const ws = wsRef.current;
    if (!ws) return;

    if (termDivRef?.current?.children.length ?? 1 > 0) {
      termDivRef.current?.children[0].remove();
    } // already loaded

    termRef.current = new xterm.Terminal({
      convertEol: true,
      disableStdin: false,
      cursorBlink: true,
      fontFamily: "monospace",
      // theme: {
      //   background: "#000000",
      //   foreground: "#ffffff",
      //   cursor: "#ffffff",
      // },
    }) as _Terminal;

    termRef.current.loadAddon(fitAddon);
    termRef.current.loadAddon(webgl);

    webgl.onContextLoss(() => {
      webgl.dispose();
    });

    if (termDivRef.current) {
      if (termDivRef.current.children.length > 0) return; // already loaded

      termRef.current.open(termDivRef.current);

      window.addEventListener("resizeRef.current", () => {
        fitAddon?.fit();
      });
    }

    ws.onopen = () => {
      console.log("connected", sizeRef.current);
      if (sizeRef.current.cols > 0 && sizeRef.current.rows > 0)
        ws.send(
          "r" +
            JSON.stringify({
              width: sizeRef.current.cols,
              height: sizeRef.current.rows,
            })
        );
    };

    ws.onmessage = async (evt) => {
      termRef.current?.write(await evt.data.text());
    };

    termRef.current?.onData((data) => {
      ws.send("m" + data);
    });

    termRef.current?.onResize((nsize) => {
      sizeRef.current = nsize;
      console.log("set size", nsize);
      if (ws.readyState == 1)
        ws.send(
          "r" + JSON.stringify({ width: nsize.cols, height: nsize.rows })
        );
    });
  };

  useEffect(() => {
    wsRef.current = new ReconnectingWebSocket(
      "ws://localhost:1323/ws?id=" + containerId
    );
    loadTerminal();

    return () => {
      wsRef.current!.close();
    };
  }, []);

  useEffect(() => {
    if (termDivRef.current) {
      const observer = new ResizeObserver(() => {
        fitAddon.fit();
      });

      observer.observe(termDivRef.current);
    }
  }, [termDivRef]);

  return (
    <>
      <div ref={termDivRef} className="h-screen overflow-hidden"></div>
      <div className="bottom-0 w-64 rounded-tl-xl text-sm px-3 right-[10px] bg-gray-2 text-gray-11 py-1 dark absolute">
        Connected to {containerId}
      </div>
    </>
  );
}
