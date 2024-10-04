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
#include <sys/wait.h>
#include <signal.h>

using namespace std;

#define MYPORT "44328"
#define MYTCPPORT "45328" 

//read member file, return the username and password
unordered_map<string, string> readFile(string fileaddr){
    ifstream file(fileaddr);

    unordered_map<string, string> res;
    string line;

    while (getline(file, line)) {
        stringstream ss(line);
        string key;
        string value;

        getline(ss, key, ',');
        ss >> value;
        res[key] = value;
    }
    file.close();
    return res;
}

//check user authorientation 
string checkAuth(unordered_map<string, string> namelist, string user){
    stringstream ss(user);
    string username,password;
    getline(ss,username,',');
    getline(ss,password,',');
    for(const auto& name:namelist){
        if(name.first==username){
            if(name.second==password){
                cout<<"Password "<<password<<" matches the username. Send a reply to the client."<<endl;
                return "1";//success
            }
            else{
                cout<<name.second<<endl;
                cout<<"Password "<<password<<" does not match the username. Send a reply to the client"<<endl;
                return "2";//wrong password
            }

        }
    }
    cout<<username<<" is not registered. Send a reply to the client."<<endl;
    return "0";//wrong username
}

//return backend server if the first letter is S,L, or H, else return -1
int findBookServer(string s){
    vector<char> booklist={'S','L','H'};
    for(const auto& book:booklist){
        if(book==s[0]){
            return book;
            break;
        }
    }
    return -1;
}


int main() {
    //create UDP socket
    struct addrinfo hints, *servinfo, *p;
    int sockid;
    int rv;

    memset(&hints,0,sizeof hints);
    hints.ai_family=AF_INET;//ipv4
    hints.ai_socktype=SOCK_DGRAM;//udp

    //get socket address
    if((rv=getaddrinfo("127.0.0.1", MYPORT, &hints, &servinfo))!=0){
        cerr << "getaddrinfo: " << gai_strerror(rv) << '\n';
        return 1;
    };

    //loop, make and bind socket
    for(p=servinfo; p!=nullptr; p=p->ai_next){
        if((sockid=socket(p->ai_family,p->ai_socktype,p->ai_protocol))==-1){
            perror("talker: socket");
            continue;
        }
        
        if(bind(sockid,p->ai_addr,p->ai_addrlen)==-1){
            close(sockid);
            perror("listen: bind");
            continue;
        }
        break;
    }
    if(p==nullptr){
        cerr <<"talker: failed to create socket\n";
        return 2;
    }

    freeaddrinfo(servinfo);
    
    cout<<"Main Server is up and running."<<endl;

    //read member file
    unordered_map<string, string> member=readFile("member.txt");
    cout<<"Main Server loaded the member list."<<endl;

    // create TCP socket
    int tsockid, new_socket; 
    struct addrinfo thints, *tservinfo, *tp;
    struct sockaddr_storage client_addr;
    socklen_t clientaddrlen;
    
    memset(&thints,0,sizeof thints);
    thints.ai_family=AF_INET;//ipv4
    thints.ai_socktype=SOCK_STREAM;//tcp

    //get socket address
    if((rv=getaddrinfo("127.0.0.1", MYTCPPORT, &thints, &tservinfo))!=0){
    cerr << "getaddrinfo: " << gai_strerror(rv) << '\n';
    return 1;
    }

    //create socket
    for(tp = tservinfo; tp != NULL; tp = tp->ai_next) {
        if ((tsockid = socket(tp->ai_family, tp->ai_socktype, p->ai_protocol)) == -1) {
            perror("server: socket");
            continue;
        }

        if (bind(tsockid, tp->ai_addr, tp->ai_addrlen) == -1) {
            close(tsockid);
            perror("server: bind");
            continue;
        }
        break;
     }

    freeaddrinfo(tservinfo);

    if(tp==nullptr){
        cerr <<"talker: failed to create TCP socket\n";
        return 2;
    }

    //Listen and Accept
    if (listen(tsockid, 20) == -1) {
        perror("listen");
        exit(1);
    }

    while (true){
        clientaddrlen=sizeof client_addr;
        //create childsocket
        new_socket=accept(tsockid,(struct sockaddr *)&client_addr,&clientaddrlen);
        if (new_socket ==-1){
            perror("accept");
            continue;
        }
        

        //authorization
        string authRes;
        while(true){
            char tbuf[100];
            int tnumbytes;
            if((tnumbytes=recv(new_socket,tbuf,sizeof(tbuf),0))==-1){
                perror("tcprecv error");
                exit(1);
            }
            cout<<"Main Server received the username and password from the client using TCP over port "<<MYTCPPORT<<"."<<endl;
            tbuf[tnumbytes]='\0';
            string user(tbuf);
            authRes=checkAuth(member,user);
            if(send(new_socket,authRes.c_str(),authRes.length(),0)==-1){
                perror("send auth res");
            }
            if(authRes=="1"){
                break;
            }
        }

        char bcbuf[100];
        int sendnumtypes,recvnumbytes;
        int response;
        string bookcode;
        struct addrinfo *sinfo,*linfo,*hinfo;
        unordered_map<char, addrinfo*> server_address;
        struct sockaddr_storage their_addr;
        socklen_t addr_len = sizeof(their_addr);
        int booknum;

        //make backend server address
        if((rv=getaddrinfo("127.0.0.1", "41328", &hints, &sinfo))!=0){
        cerr << "getaddrinfo: " << gai_strerror(rv) << '\n';
        return 1;
        }
        server_address['S']=sinfo;
        if((rv=getaddrinfo("127.0.0.1", "42328", &hints, &linfo))!=0){
        cerr << "getaddrinfo: " << gai_strerror(rv) << '\n';
        return 1;
        }
        server_address['L']=linfo;
        if((rv=getaddrinfo("127.0.0.1", "43328", &hints, &hinfo))!=0){
        cerr << "getaddrinfo: " << gai_strerror(rv) << '\n';
        return 1;
        }
        server_address['H']=hinfo;


        while(true){
            //receive bookcode from client
            int bcnumtypes=recv(new_socket,bcbuf,sizeof(bcbuf),0);
            if(bcnumtypes==-1){
                perror("recv bookcode");
                exit(1);
            }
            if(bcnumtypes==0){
                break;
            }
            cout<<"Main Server received the book request from client using TCP over port "<<MYTCPPORT<<"."<<endl;
            bcbuf[bcnumtypes]='\0';
            bookcode=string(bcbuf+1);

            //check whether the bookcode is in one of the backend server
            if((findBookServer(bookcode))==-1){
                cout<<"Did not find "<<bookcode<<" in the book code list."<<endl;
                response=htonl(-1);
            }
            else{
                //use UDP to send request to corresponding backend server 
                cout<<"Found "<<bookcode<<" located at Server "<<bookcode[0]<<". Send to Server "<<bookcode[0]<<"."<<endl;
                if((sendnumtypes=sendto(sockid,bcbuf,sizeof(bcbuf),0,server_address[bookcode[0]]->ai_addr,server_address[bookcode[0]]->ai_addrlen))==-1){
                    perror("talker: send to server");
                    exit(1);
                }
                //receive respond from backend server
                if((recvnumbytes=recvfrom(sockid,&response,sizeof(response),0,(struct sockaddr *)&their_addr, &addr_len)==-1)){
                    perror("talker: recv from server error");
                    exit(1);
                }
                booknum=ntohl(response);
                if(booknum==-1){
                    cout<<"Did not find "<<bookcode<<" in the book code list."<<endl;
                }
                else{
                    cout<<"Main Server received from server "<<bookcode[0]<<" the book status result using UDP over port "<< MYPORT<< ": Number of books "<<bookcode<<" available is: "<<ntohl(response)<<"."<<endl;
                }
            }
            //use TCP to send respond to client 
            if((bcnumtypes=send(new_socket,&response,sizeof(response),0))==-1){
                perror("talker:send to client error");
                exit(1);
            }
            cout<<"Main Server sent the book status to the client."<<endl;
        }
        //close child socket
        shutdown(new_socket, SHUT_RDWR);
        close(new_socket);
    }
    //close parent socket and UDP socket
    close(sockid);
    close(tsockid);
    return 0;
}