#insert valid params here
$plusername  = "testpl"
$plpassword = "abc123!!"
$devusername = 'testdev'
$devpassword = "abc123!!"
$acronym = "zoo"
$name = "new"
$description = 'doing'
$notes = 'asdfasdf'
$plan = 'sprint1'




Write-Output    "Any points listed are errors"
try {
    # url
    Write-Output ""
    Write-Output "Testing URL"
    Write-Output ""
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/CreateTask?"
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "A001") {
        Write-Output "- url special char, code is $($response.code)"
    }

    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/CreateTask"
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -eq "A001") {
        Write-Output "- url camelcase, code is $($response.code)"
    }
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/CREATETASK"
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -eq "A001") {
        Write-Output "- url uppercase, code is $($response.code)"
    }
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask"
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -eq "A001") {
        Write-Output "- url lowercase, code is $($response.code)"
    }
    try {
        $response = Invoke-RestMethod -Method 'Get' -Uri "http://localhost:3000/createtask"
        Write-Output "- request type get, code is $($response.code)"
    }
    catch {
    }

    # body
    Write-Output ""
    Write-Output "URL Tests done, Testing body"
    Write-Output ""
    
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask"
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "B001") {
        Write-Output "- missing body, code is $($response.code)"
    }

    $body = @{f = 'f' } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/javascript" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "B001") {
        Write-Output "- wrong body type, code is $($response.code)"
    }

    $body = @{} | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "B002") {
        Write-Output "- No keys, code is $($response.code)"
    }

    $body = @{username = $plusername  } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "B002") {
        Write-Output "- Partial keys, code is $($response.code)"
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "S000") {
        Write-Output "- no optional keys, code is $($response.code)"
    }

    $body = @{
        username         = "*"
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
        f                = "f"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -eq "B002") {
        Write-Output "- extra keys, code is $($response.code)"
    }

    # iam
    Write-Output ""
    Write-Output "*note duplicate keys cant be tested here"
    Write-Output "Body Tests done, Testing IAM"
    Write-Output ""

    $body = @{
        username    = $plusername 
        password    = 'wrongpassword'
        task_app_acronym = $acronym
        task_name        = $name
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "C001") {
        Write-Output "- Invalid credentials, code is $($response.code)"
    }

    $body = @{
        username    = $devusername
        password    = $devpassword
        task_app_acronym = $acronym
        task_name        = $name
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "C001") {
        Write-Output "- unauthorised dealer, code is $($response.code)"
    }

    # # transaction
    # Write-Output ""
    # Write-Output "IAM Tests done, Testing Transaction"
    # Write-Output ""

    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = ''
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- missing state, code is $($response.code)"
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = $state
    #     app_acronym = ''
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- missing acronym, code is $($response.code)"
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = 'dne'
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- state DNE, code is $($response.code)"
    # }
    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = 'open'
    #     app_acronym = 'this should not exist!'
    # } | ConvertTo-Json

    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- acronym DNE, code is $($response.code)"
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = 'OPEN'
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "S000") {
    #     Write-Output "- capitalized state, code is $($response.code)"
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = 'open'
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "S000") {
    #     Write-Output "- lowercase state, code is $($response.code)"
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = 'Open'
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "S000") {
    #     Write-Output "- camelcase state, code is $($response.code)"
    # }



    # $body = @{
    #     username    = "123456789012345678901234567890123456789012345678901"
    #     password    = $plpassword
    #     task_state  = $state
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- username too long, code is $($response.code) "
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = "123456789012345678901234567890123456789012345678901"
    #     task_state  = $state
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- password too long, code is $($response.code) "
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = "123456789012345678901234567890123456789012345678901"
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- state too long, code is $($response.code)"
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = $state
    #     app_acronym = "123456789012345678901234567890123456789012345678901"
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- acronym too long, code is $($response.code)"
    # }

    # $body = @{
    #     username    = 12345
    #     password    = $plpassword
    #     task_state  = $state
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- username  wrong type, code is $($response.code) "
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = 12345
    #     task_state  = $state
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- password  wrong type, code is $($response.code) "
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = 12345
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- state  wrong type, code is $($response.code)"
    # }

    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = $state
    #     app_acronym = 12345
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # if ($response.code -ne "D001") {
    #     Write-Output "- acronym wrong type, code is $($response.code)"
    # }

    # # visual test
    # Write-Output ""
    # Write-Output "automated tests done, check value of state from db"
    # Write-Output ""
    # $body = @{
    #     username    = $plusername 
    #     password    = $plpassword
    #     task_state  = $state
    #     app_acronym = $acronym
    # } | ConvertTo-Json
    # $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    # if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    # Write-Output $response.tasks
    # Write-Output ""
    # Write-Output $response.code
}
catch {
    Write-Output "Error: Unable to reach API - $($_.Exception.Message)" 
    exit 1
}

