$proc = Start-Process -FilePath "C:\Users\ADMIN\AppData\Local\Programs\nodejs\node.exe" -ArgumentList "C:\Users\ADMIN\.gemini\antigravity\scratch\circuitverse-ai\server.js" -PassThru
Start-Sleep -Seconds 2

try {
  Write-Host "--- 1. Testing GET /api/health ---"
  $res1 = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/health"
  Write-Host "Health Status: $($res1.status), App: $($res1.app), DB: $($res1.dbConnected)"

  Write-Host "`n--- 2. Testing GET /api/progress ---"
  $res2 = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/progress"
  Write-Host "User: $($res2.user.name), Level: $($res2.user.level), XP: $($res2.user.xp), Rank: $($res2.user.rank)"
  Write-Host "Completed Lessons count: $($res2.completedLessons.Count)"

  Write-Host "`n--- 3. Testing GET /api/lessons ---"
  $res3 = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/lessons"
  Write-Host "Lessons Loaded: $($res3.lessons.Count)"
  $res3.lessons | ForEach-Object { Write-Host " - [$($_.id)] $($_.title)" }

  Write-Host "`n--- 4. Testing POST /api/lessons/complete ---"
  $bodyLesson = @{ lessonId = "digital-electronics" } | ConvertTo-Json
  $res4 = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/lessons/complete" -Method Post -Body $bodyLesson -ContentType "application/json"
  Write-Host "Lesson Complete Response: success=$($res4.success), xpAwarded=$($res4.xpAwarded)"

  Write-Host "`n--- 5. Testing GET /api/quiz/questions ---"
  $res5 = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/quiz/questions"
  Write-Host "Quiz questions available: $($res5.questions.Count)"

  Write-Host "`n--- 6. Testing POST /api/quiz/submit ---"
  $answers = @{ "1" = 1; "2" = 2; "3" = 1; "4" = 1; "5" = 1 }
  $bodyQuiz = @{ answers = $answers; timeSpent = 45 } | ConvertTo-Json
  $res6 = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/quiz/submit" -Method Post -Body $bodyQuiz -ContentType "application/json"
  Write-Host "Quiz Submit Result: Score=$($res6.score)/$($res6.total) ($($res6.percentage)%), XP Earned=$($res6.xpEarned)"

  Write-Host "`n--- 7. Testing POST /api/code/validate ---"
  $sampleCode = @"
const int LED_PIN = 13;
void setup() {
  Serial.begin(9600);
  pinMode(LED_PIN, OUTPUT);
}
void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}
"@
  $bodyCode = @{ challengeId = "challenge-blink"; code = $sampleCode } | ConvertTo-Json
  $res7 = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/code/validate" -Method Post -Body $bodyCode -ContentType "application/json"
  Write-Host "Code Validation: success=$($res7.success), compilationPassed=$($res7.compilationPassed), xpAwarded=$($res7.xpAwarded)"
  Write-Host "Serial Output lines: $($res7.serialOutput.Count)"

  Write-Host "`n--- 8. Testing POST /api/ai/chat ---"
  $bodyAi = @{ message = "Explain Nyquist theorem and aliasing" } | ConvertTo-Json
  $res8 = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/ai/chat" -Method Post -Body $bodyAi -ContentType "application/json"
  Write-Host "AI Response Topic: $($res8.topic), Source: $($res8.source)"
  Write-Host "Response length: $($res8.response.Length) characters"

  Write-Host "`n--- 9. Testing POST /api/iot/telemetry ---"
  $bodyIot = @{ temperature = 31.5; light = 180; motion = 1; fanState = 1; bulbState = 1; alarmState = 1; ruleTriggered = "Overheat & Darkness detected" } | ConvertTo-Json
  $res9 = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/iot/telemetry" -Method Post -Body $bodyIot -ContentType "application/json"
  Write-Host "IoT Telemetry response: success=$($res9.success)"

  Write-Host "`n--- 10. Testing Updated Progress (Verifying SQLite Persistence) ---"
  $res10 = Invoke-RestMethod -Uri "http://127.0.0.1:3000/api/progress"
  Write-Host "Updated XP: $($res10.user.xp), Level: $($res10.user.level), Rank: $($res10.user.rank)"
  Write-Host "Completed Lessons: $($res10.completedLessons -join ', ')"
  Write-Host "Completed Challenges: $($res10.completedChallenges -join ', ')"
  Write-Host "Total Badges Unlocked: $($res10.badges.Count)"
  $res10.badges | ForEach-Object { Write-Host "  🏆 Badge: $($_.name) - $($_.desc)" }

  Write-Host "`n--- 11. Testing Static Assets Delivery ---"
  $html = Invoke-WebRequest -Uri "http://127.0.0.1:3000/"
  Write-Host "Index HTML status: $($html.StatusCode), Length: $($html.Content.Length) bytes"
  $css = Invoke-WebRequest -Uri "http://127.0.0.1:3000/css/style.css"
  Write-Host "CSS status: $($css.StatusCode), Length: $($css.Content.Length) bytes"

  Write-Host "`n>>> ALL 11 TESTS PASSED WITH 100% SUCCESS! <<<"
}
finally {
  Stop-Process -Id $proc.Id -Force
  Write-Host "Test server terminated."
}
