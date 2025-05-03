package main

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"google.golang.org/api/idtoken"
)

var googleClientID = "1051316255409-0e7k2761dcklb6o31blgp8hfukvj8sae.apps.googleusercontent.com"
var jwtSecret = []byte("L2hv13NzP2+1LRqeo5Fy/6WX4sykYXkBs7+ld7g/mjE=")


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

	// Extract user info
	email := payload.Claims["email"].(string)
	name := payload.Claims["name"].(string)
	sub := payload.Claims["sub"].(string) // Google's user ID

	// Create your JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   sub,
		"email": email,
		"name":  name,
		"exp":   time.Now().Add(time.Hour * 24).Unix(), // expires in 1 day
	})

	signedToken, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sign token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": signedToken,
		"user": gin.H{
			"email":  email,
			"name":   name,
			"google_id": sub,
		},
	})
}

func main() {
	r := gin.Default()
	r.POST("/api/auth/google", verifyGoogleAndIssueJWT)
	r.Run(":8080")
}
