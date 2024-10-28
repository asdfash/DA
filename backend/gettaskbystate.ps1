#insert valid user, state,acronym here (that has actual tasks)
$username = "testdev"
$password = "abc123!!"
$state = 'doing'
$acronym = "zoo" #insert valid acronym here


Write-Output "Any points listed are errors"
try {
    #URL
    Write-Output ""
    Write-Output "Testing URL"
    Write-Output ""
    #specialchar
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/GetTaskByState?"
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "A001") {
        Write-Output "- url special char"
    }

    # caseinsensitive
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/GetTaskByState"
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -eq "A001") {
        Write-Output "- url camelcase"
    }
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/GETTASKBYSTATE"
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -eq "A001") {
        Write-Output "- url uppercase"
    }
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate"
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -eq "A001") {
        Write-Output "- url lowercase"
    }
    try {
        $response = Invoke-RestMethod -Method 'Get' -Uri "http://localhost:3000/gettaskbystate"
        Write-Output "request type get"
    }
    catch {
    }

    # #test body
    Write-Output ""
    Write-Output "URL Tests done, Testing body"
    Write-Output ""
    
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate"
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "B001") {
        Write-Output "missing body"
    }

    $body = @{f = 'f' } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/javascript" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "B001") {
        Write-Output "wrong body type"
    }

    $body = @{} | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "B002") {
        Write-Output "No keys"
    }

    $body = @{username = $username } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "B002") {
        Write-Output "Partial keys"
    }

    $body = @{
        username    = $username
        password    = ''
        task_state  = 'open'
        app_acronym = ''
        f           = "f"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -eq "B002") {
        Write-Output "extra keys"
    }

    Write-Output ""
    Write-Output "*note duplicate keys cant be tested here"
    Write-Output "Body Tests done, Testing IAM"
    Write-Output ""

    $body = @{
        username    = $username
        password    = ''
        task_state  = 'open'
        app_acronym = ''
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "C001") {
        Write-Output "Invalid credentials"
    }

    Write-Output ""
    Write-Output "IAM Tests done, Testing Transaction"
    Write-Output ""

    $body = @{
        username    = $username
        password    = $password
        task_state  = ''
        app_acronym = '*'
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "missing state"
    }

    $body = @{
        username    = $username
        password    = $password
        task_state  = 'open'
        app_acronym = ''
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "missing acronym"
    }

    $body = @{
        username    = $username
        password    = $password
        task_state  = 'dne'
        app_acronym = $acronym
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D004") {
        Write-Output "state DNE"
    }
    $body = @{
        username    = $username
        password    = $password
        task_state  = 'open'
        app_acronym = 'this should not exist!'
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D004") {
        Write-Output "acronym DNE"
    }

    $body = @{
        username    = $username
        password    = $password
        task_state  = 'OPEN'
        app_acronym = $acronym
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "S000") {
        Write-Output "capitalized state"
    }

    $body = @{
        username    = "123456789012345678901234567890123456789012345678901"
        password    = $password
        task_state  = 'OPEN'
        app_acronym = $acronym
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D004") {
        Write-Output "username too long"
    }

    $body = @{
        username    = $username
        password    = "123456789012345678901234567890123456789012345678901"
        task_state  = 'OPEN'
        app_acronym = $acronym
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D004") {
        Write-Output "password too long"
    }

    $body = @{
        username    = $username
        password    = $password
        task_state  = "123456789012345678901234567890123456789012345678901"
        app_acronym = $acronym
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D004") {
        Write-Output "state too long"
    }

    $body = @{
        username    = $username
        password    = $password
        task_state  = 'OPEN'
        app_acronym = "123456789012345678901234567890123456789012345678901"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D004") {
        Write-Output "acronym too long"
    }


    # visual test
    $body = @{
        username    = $username
        password    = $password
        task_state  = $state
        app_acronym = $acronym
    } | ConvertTo-Json
    Write-Output "automated tests done, check value of state from db"
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    Write-Output $response
}
catch {
    Write-Output "Error: Unable to reach API - $($_.Exception.Message)" 
    exit 1
}

