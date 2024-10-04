a. Name: Jinzhe Han
b. Student ID: 4943947328
c. I have added a leading character 'A' ahead of each bookcode if it is sent by admin and 'S' if it is sent by student in client and the backend server can 
        distinguish by the leading character and send back different result. If the leading character is 'A', backend server will send the amount of book and 
        if 'S', send 1 if available and 0 if not available and -1 if not found.
d.  client.cpp: Communicate with user. Encypt the username and password, send it to main server and show result to user according to the respond by mian server.
        Send bookcode request to main server and show the result from main server.
    serverM: check the authentication of each user and reply to client. Receive bookcode request from client, check whether the bookcode is start by H, S or L,
        if yes, send request to backend server and reply the client according to respond from the backend server; if no, reply the client.
    serverH.cpp: check the availability and amount(extra) for each book and reply to main server
    serverS.cpp: check the availability and amount(extra) for each book and reply to main server
    serverL.cpp: check the availability and amount(extra) for each book and reply to main server
e.  From client to main server:  username and password are encrypted and delimited by comma
                                'A'+Bookcode if the user is admin and 'S'+Bookcode if user is student
    From main server to client: authentication part send "0" if wrong username, send "2" if wrong password, send "1" if succeed
                                Bookcode part forward to client exactly what backend server send to it 
    From main server to backend server: forward to backend server exactly what client send to it
    From backend server to main server: send 1 if available, 0 if not available, -1 if not found
                                        extra part send num of books if available and -1 if not available
g. NO
h. NO