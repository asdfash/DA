#insert valid params here
$plusername = "testpl"
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

    $body = @{username = $plusername } | ConvertTo-Json
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
        username         = $plusername 
        password         = 'wrongpassword'
        task_app_acronym = $acronym
        task_name        = $name
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "C001") {
        Write-Output "- Invalid credentials, code is $($response.code)"
    }

    $body = @{
        username         = $devusername
        password         = $devpassword
        task_app_acronym = $acronym
        task_name        = $name
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/createtask" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "C003") {
        Write-Output "- unauthorised user, code is $($response.code)"
    }

    # transaction
    Write-Output ""
    Write-Output "IAM Tests done, Testing Transaction. WIP, so non exhaustive"
    Write-Output ""

    $body = @{
        username         = 12345
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- username wrong type, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = 12345
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- password  wrong type, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = 12345
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- acronym wrong type, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = 12345
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- taskname wrong type, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = 12345
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- description wrong type, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = 12345
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- notes wrong type, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = 12345
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- plan wrong type, code is $($response.code) "
    }
   
    $body = @{
        username         = "123456789012345678901234567890123456789012345678901"
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- username too long, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = "123456789012345678901234567890123456789012345678901"
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- password  too long, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = "123456789012345678901234567890123456789012345678901"
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- acronym too long, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec."
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- taskname too long, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = "123456789012345678901234567890123456789012345678901"
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- description too long, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = "123456789012345678901234567890123456789012345678901"
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- plan too long, code is $($response.code) "
    }

    $body = @{
        username         = ""
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- username missing, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = ""
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- password  missing, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = ""
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- acronym missing, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = ""
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- taskname missing, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = ""
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "S000") {
        Write-Output "- description missing, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = ""
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "S000") {
        Write-Output "- notes missing, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = ""
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "S000") {
        Write-Output "- plan missing, code is $($response.code) "
    }

    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = $acronym
        task_name        = "this should be DNE!"
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- taskname dne, code is $($response.code) "
    }
    $body = @{
        username         = $plusername
        password         = $plpassword
        task_app_acronym = "this should be DNE!"
        task_name        = $name
        task_description = $description
        task_notes       = $notes
        task_plan        = $plan
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Method 'Post' -Uri "http://localhost:3000/gettaskbystate" -ContentType "application/json" -Body $Body
    if ($response -is [string]) { $response = $response | ConvertFrom-Json }
    if ($response.code -ne "D001") {
        Write-Output "- acronym dne, code is $($response.code) "
    }

}
catch {
    Write-Output "Error: Unable to reach API - $($_.Exception.Message)" 
    exit 1
}

