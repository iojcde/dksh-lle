"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  const [size, setSize] = React.useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const newWs = new ReconnectingWebSocket(
     // "ws://localhost:1323/ws?id=" + containerId
     "wss://glorious-guacamole-77gw4v6rg57hrq99-1323.app.github.dev/ws?id=" + containerId
    );

    loadTerminal(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  const loadTerminal = (ws: ReconnectingWebSocket) => {
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

      window.addEventListener("resize", () => {
        fitAddon?.fit();
      });
    }

    ws.onopen = () => {
      if (size.cols > 0 && size.rows > 0)
        ws.send("r" + JSON.stringify({ width: size.cols, height: size.rows }));
      else 
    };

    ws.onmessage = async (evt) => {
      termRef.current?.write(await evt.data.text());
    };

    termRef.current?.onData((data) => {
      ws.send("m" + data);
    });

    termRef.current?.onResize((size) => {
      setSize(size);
      if (ws.readyState == 1)
        ws.send("r" + JSON.stringify({ width: size.cols, height: size.rows }));
    });
  };

  useEffect(() => {
    if (termDivRef.current) {
      const observer = new ResizeObserver(() => {
        fitAddon.fit();
      });

      observer.observe(termDivRef.current);
    }
  }, [termDivRef]);

  return <div ref={termDivRef} className="h-full"></div>;
}
