# Rapport d'usage de l'IA - TP1

Pour chaque mission, détailler et fournir des explications concernant : objectif; prompt principal; plan proposé par l'agent; vérifications réalisées par le binôme; erreurs ou propositions rejetées; fichiers effectivement modifiés; preuve de fonctionnement; ce que chaque membre sait maintenant expliquer sans l'agent.

{
    "id": "6aabf87dae7a7a3aa0c298b1",
    "ownerId": "6aabf3f2ae7a7a3aa0c298b0",
    "title": "test file",
    "originalName": "song1.mp3",
    "mimeType": "audio/mpeg",
    "size": 3605337,
    "createdAt": "2026-09-17T14:26:05.763Z"
}
------WebKitFormBoundaryZKiXLX77rSTiJRqY
Content-Disposition: form-data; name="audio"; filename="song1.mp3"
Content-Type: audio/mpeg


------WebKitFormBoundaryZKiXLX77rSTiJRqY
Content-Disposition: form-data; name="title"

test file
------WebKitFormBoundaryZKiXLX77rSTiJRqY--


--

{
    "items": [
        {
            "ownerId": "6aabf3f2ae7a7a3aa0c298b0",
            "title": "test file",
            "originalName": "song1.mp3",
            "mimeType": "audio/mpeg",
            "size": 3605337,
            "createdAt": "2026-09-17T14:26:05.763Z",
            "updatedAt": "2026-09-17T14:26:05.763Z",
            "__v": 0,
            "id": "6aabf87dae7a7a3aa0c298b1"
        }
    ],
    "page": 1,
    "limit": 5,
    "total": 1,
    "pages": 1
}

--

1
3
3,61 Mo
3,61 Mo
0
Résumé
URL: http://localhost:4200/api/tracks/6aabf87dae7a7a3aa0c298b1/audio
État: 200 OK
Source: Réseau
Adresse: ::1:4200
Initiateur: 
main.js:5:11250

Requête
GET /api/tracks/6aabf87dae7a7a3aa0c298b1/audio HTTP/1.1
Accept: application/json, text/plain, */*
Accept-Encoding: gzip, deflate
Accept-Language: fr-FR,fr;q=0.9
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YWFiZjNmMmFlN2E3YTNhYTBjMjk4YjAiLCJlbWFpbCI6ImRlbW9AZXhhbXBsZS5jb20iLCJpYXQiOjE3ODk2NTQ3OTcsImV4cCI6MTc4OTY2MTk5N30.m2dEkA9x3zi5b3auwosfTn2hfN0xOBGOXuXed2ZFg9w
Connection: keep-alive
Priority: u=3, i
Referer: http://localhost:4200/tracks
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6.2 Safari/605.1.15

Réponse
HTTP/1.1 200 OK
Accept-Ranges: bytes
Access-Control-Allow-Origin: *
Cache-Control: public, max-age=0
Connection: close
Content-Length: 3605337
Content-Type: audio/mpeg
Date: Thu, 17 Sep 2026 14:27:08 GMT
ETag: W/"370359-1a0afc2ab41"
Last-Modified: Thu, 17 Sep 2026 14:26:05 GMT
Vary: Origin
x-powered-by: Express

