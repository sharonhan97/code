#include <iostream>
#include <cstring>
#include <cstdio>
#include <cstdlib>
#include <unistd.h>
#include <cerrno>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <netdb.h>
#include <fstream>
#include <sstream>
#include <string>
#include <unordered_map>
#include <vector>

#define SERVERPORT "45328"

using namespace std;

//encrypt username and password
char offsetChar(char c) {
    if (c >= 'a' && c <= 'z') {
        return 'a' + (c - 'a' + 5) % 26;
    } else if (c >= 'A' && c <= 'Z') {
        return 'A' + (c - 'A' + 5) % 26;
    } else if (c >= '0' && c <= '9') {
        return '0' + (c - '0' + 5) % 10;
    } else {
        return c;
    }
}
string encrypt(const string& input) {
    string res;
    for (char c : input) {
        res += offsetChar(c);
    }
    return res;
}

int main(){
    cout<<"Client is up and running."<<endl;

    struct addrinfo hints, *servinfo, *p;
    int sockid;
    int rv;
    int numbytes;
    string username,password;
    string enuser;
    string bookcode,query;
    int bookamt;

    memset(&hints,0,sizeof hints);
    hints.ai_family=AF_INET;//ipv4
    hints.ai_socktype=SOCK_STREAM;//tcp

    //get socket address
    if((rv=getaddrinfo("127.0.0.1", SERVERPORT, &hints, &servinfo))!=0){
    cerr << "getaddrinfo: " << gai_strerror(rv) << '\n';
    return 1;
    }

    //loop and make TCP socket
    for(p=servinfo; p!=nullptr; p=p->ai_next){
        if((sockid=socket(p->ai_family,p->ai_socktype,p->ai_protocol))==-1){
            perror("talker: socket");
            continue;
        }
        if(connect(sockid,p->ai_addr,p->ai_addrlen)==-1){
            close(sockid);
            perror("client: connnect");
            continue;
        }
        break;
    }
    if(p==nullptr){
        cerr <<"talker: failed to create socket/n";
        return 2;
    }

    struct sockaddr_in localAddr;
    socklen_t addr_size = sizeof(localAddr);

    //get TCP port num 
    if(getsockname(sockid, (struct sockaddr*)&localAddr, &addr_size) == -1) {
    perror("getsockname");
    return 3;
    }

    int localPort = ntohs(localAddr.sin_port);

    freeaddrinfo(servinfo);


    while(true){
        //start auth

        //enter user name and password
        cout<<"Please enter the username: ";
        getline(cin, username);
        cout<<"Please enter the password: ";
        getline(cin, password);
        enuser=encrypt(username)+","+encrypt(password);


        //send encrypted username and password to main server
        if((numbytes=send(sockid,enuser.c_str(),enuser.length(),0))==-1){
            perror("send");
        }
        else{
            cout<<username<<" sent an authentication request to the Main Server."<<endl;
        }

        //receive auth result
        char res[2];
        if(recv(sockid,&res,sizeof(res),0)==-1){
            perror("recv auth res");
        }
        res[1]='\0';
        if (res[0]=='1'){
            cout<<username<<" received the result of authentication from Main Server using TCP over port "<<localPort<<". Authentication is successful."<<endl;
            //leave the auth loop
            break;
        }
        else if (res[0]=='0')
        {
            cout<<username<<" received the result of authentication from Main Server using TCP over port "<<localPort<<". Authentication failed: Username not found."<<endl;
        }
        else if (res[0]=='2')
        {
            cout<<username<<" received the result of authentication from Main Server using TCP over port "<<localPort<<". Authentication failed: Password does not match."<<endl;
        }
    }

    //query part
    //extra(admin)
    if (username=="admin"){
        while(true){
            cout<<"Please enter book code to query: ";
            getline(cin,bookcode);
            query="A"+bookcode;//let main server know it is a admin request
            
            //send TCP request to main server
            if((numbytes=send(sockid,query.c_str(),query.length(),0))==-1){
                perror("send");
                exit(1);
                }
            cout<<"Request sent to the Main Server with Admin rights."<<endl;
            //recv respond from main server
            if((numbytes=recv(sockid,&bookamt,sizeof(bookamt),0))==-1){
                perror("recv book amount");
                exit(1);
            }
            cout<<"Response received from the Main Server on TCP port: "<<SERVERPORT<<"."<<endl;
            bookamt = ntohl(bookamt);
            if(bookamt==-1){
                cout<<"Not able to find the book-code "<< bookcode<<" in the system."<<endl;
            }
            else{
                cout<<"Total number of book "<<bookcode<<" available = "<<bookamt<<endl;
            }
        }        
    }
    //normal(student)
    else{
        while(true){
            cout<<"Please enter book code to query: ";
            getline(cin,bookcode);
            query="S"+bookcode;//let main server know it is a student request

            //send TCP request to main server
            if((numbytes=send(sockid,query.c_str(),query.length(),0))==-1){
                perror("send");
                exit(1);
                }
            cout<<username<<" sent the request to the Main Server."<<endl;
            //recv respond from main server
            if((numbytes=recv(sockid,&bookamt,sizeof(bookamt),0))==-1){
                perror("recv book amount");
                exit(1);
            }
            cout<<"Response received from the Main Server on TCP port: "<<localPort<<"."<<endl;
            bookamt = ntohl(bookamt);
            if(bookamt==-1){
                cout<<"Not able to find the book-code "<< bookcode<<" in the system."<<endl;
            }
            else if (bookamt==0)
            {
                cout<<"The requested book "<<bookcode<<" is NOT available in the library."<<endl;
            }
            else{
                cout<<"The requested book "<<bookcode<<" is available in the library."<<endl;
            }
        }
    }
    shutdown(sockid, SHUT_RDWR);
    close(sockid);
    return 0;
}
