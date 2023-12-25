package main

import (
	"crypto/sha256"
	"encoding/json"
	"io"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/lestrrat-go/jwx/v2/jwa"
	"github.com/lestrrat-go/jwx/v2/jwe"
	"golang.org/x/crypto/hkdf"
)

func getSession(c echo.Context) (*SessionToken, error) {

	rawJwe, _ := c.Request().Cookie("next-auth.session-token")
	nextAuthSecret := os.Getenv("NEXTAUTH_SECRET")
	info := "NextAuth.js Generated Encryption Key"

	// Step 1: Generate the decryption key with an hdkf lib
	hash := sha256.New
	kdf := hkdf.New(hash, []byte(nextAuthSecret), []byte(""), []byte(info))
	key := make([]byte, 32)
	_, _ = io.ReadFull(kdf, key)

	// Step 2: Decrypt with a JWE library.
	// Here we use lestrrat-go/jwx, which parses the JWE and
	// uses the JWE header info to choose the decryption algorithm.
	decrypted, err := jwe.Decrypt([]byte(rawJwe.Value),
		jwe.WithKey(jwa.DIRECT, key))

	if err != nil {
		return nil, err

	}
	session := SessionToken{}

	err = json.Unmarshal(decrypted, &session)
	if err != nil {
		return nil, err
	}
	return &session, nil

}
