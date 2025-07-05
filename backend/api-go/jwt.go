package main

import (
	"context"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"google.golang.org/api/idtoken"
)

var googleClientID string
var jwtSecret []byte

type TokenRequest struct {
	IdToken string `json:"idToken"`
}

func verifyGoogleAndIssueJWT(c *gin.Context) {
	var req TokenRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	payload, err := idtoken.Validate(context.Background(), req.IdToken, googleClientID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid ID token"})
		return
	}

	email := payload.Claims["email"].(string)
	name := payload.Claims["name"].(string)
	sub := payload.Claims["sub"].(string)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   sub,
		"email": email,
		"name":  name,
		"exp":   time.Now().Add(time.Hour * 168).Unix(),
	})

	signedToken, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sign token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": signedToken,
		"user": gin.H{
			"email":     email,
			"name":      name,
			"google_id": sub,
		},
	})
}

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		panic("Error loading .env file")
	}

	// Read from env
	googleClientID = os.Getenv("GOOGLE_CLIENT_ID")
	jwtSecret = []byte(os.Getenv("JWT_SECRET"))

	r := gin.Default()
	
	r.POST("/api/auth/google", verifyGoogleAndIssueJWT)
	r.Run(":8080")
}
