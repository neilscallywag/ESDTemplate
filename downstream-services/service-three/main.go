package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/", helloHandler)
	log.Println("Starting server on port 8083")
	log.Fatal(http.ListenAndServe(":8083", nil))
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Service three default endpoint hit")
}
