package main

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"
    "time"
    
  _ "github.com/mattn/go-sqlite3"
)

type EntrySearch struct {
    ID                      string `json:"id"`
    Title                   string `json:"title"`
}
type EntryMeta struct {
    ID                      string `json:"id"`
    Title                   string `json:"title"`
    AlternateTitles         string `json:"alternateTitles"`
    Series                  string `json:"series"`
    Developer               string `json:"developer"`
    Publisher               string `json:"publisher"`
    Tags                    string `json:"tagsStr"`
    Platform                string `json:"platform"`
    PlayMode                string `json:"playMode"`
    Status                  string `json:"status"`
    Notes                   string `json:"notes"`
    Source                  string `json:"source"`
    ReleaseDate             string `json:"releaseDate"`
    Version                 string `json:"version"`
    OriginalDescription     string `json:"originalDescription"`
    Language                string `json:"language"`
}

var db *sql.DB
var dbErr error

func main() {
    db, dbErr = sql.Open("sqlite3", "flashpoint.sqlite")
    if dbErr != nil {
        log.Fatal(dbErr)
    }
    
    defer db.Close()
    log.Println("connected to flashpoint.sqlite")
    
    http.HandleFunc("/search/", searchHandler)
    http.HandleFunc("/meta/",   metaHandler  )
    
    server := &http.Server{
        Addr: "127.0.0.1:8986",
        WriteTimeout: 15 * time.Second,
        ReadTimeout:  15 * time.Second,
    }
    
    log.Printf("server started at %v\n", server.Addr)
    log.Fatal(server.ListenAndServe())
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
    var entries []EntrySearch
    
    if query := r.URL.Path[8:]; len(query) >= 3 {
        rows, err := db.Query(`
            SELECT   id, title 
            FROM     game 
            WHERE    title LIKE ?
        `, "%" + query + "%")
        if err != nil {
            log.Fatal(err)
        }
        
        for rows.Next() {
            var entry EntrySearch
            
            err := rows.Scan(&entry.ID, &entry.Title)
            if err != sql.ErrNoRows && err != nil {
                log.Fatal(err)
            }
            
            entries = append(entries, entry)
        }
    }
    
    results, err := json.Marshal(entries)
    if err != nil {
        log.Fatal(err)
    }
    
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(results))
    
    log.Printf("served %v\n", r.URL.RequestURI())
}

func metaHandler(w http.ResponseWriter, r *http.Request) {
    var entry EntryMeta
    
    if id := r.URL.Path[6:]; len(id) == 36 {
        row := db.QueryRow(`
            SELECT id, title, alternateTitles, series, developer, publisher, tagsStr, platform, playMode, status, notes, source, releaseDate, version, originalDescription, language
            FROM   game
            WHERE  id = ?
        `, id)
        
        err := row.Scan(&entry.ID, &entry.Title, &entry.AlternateTitles, &entry.Series, &entry.Developer, &entry.Publisher, &entry.Tags, &entry.Platform, &entry.PlayMode, &entry.Status, &entry.Notes, &entry.Source, &entry.ReleaseDate, &entry.Version, &entry.OriginalDescription, &entry.Language)
        if err != sql.ErrNoRows && err != nil {
            log.Fatal(err)
        }
    }
    
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(entry)
    
    log.Printf("served %v\n", r.URL.RequestURI())
}