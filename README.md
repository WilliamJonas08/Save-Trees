# Firebase-Application

Firebase link url
https://console.firebase.google.com/project/fir-app-e94c4/settings/general/web:MDhjYzAxNTktOTRmMS00NWFhLThkNjYtMWEzODQ0NWVkZGU3

Firebase relevant ressources:
https://github.com/angular/angularfire/blob/master/docs/rtdb/lists.md

    TODO: 
  -gérer l'ajout d'un résultat au leaderboard dans le cas d'un record battu
- augmenter la vitesse de click des composants générés (les clicks ne sont pas toujours directement détectés !!)


firebase.json

{
  "database": {
    "rules": "database.rules.json"
  },
  "hosting": {
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}


.firebaserc

{
  "projects": {
    "default": "fir-app-e94c4"
  },
  "targets": {
    "fir-app-e94c4": {
      "hosting": {
        "app": [
          "fir-app-e94c4"
        ]
      }
    }
  }
}



database.rules.json

{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "tree": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "userProfile": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}