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

using namespace std;

#define SERVERPORT "44328" 
#define MYPORT "43328"

//get book available status, return -1 means not found, 0 means not available, 1 means available 
int getBookAvail(string code,unordered_map<string, int>& bookMap){
    int res;
    if (bookMap.find(code) != bookMap.end()) {
        if(bookMap[code]>=1){
            res=1;
            bookMap[code]-=1;           
        }
        else{
            res=0;
        }  
    } 
    else {
        res=-1;
    }
    return res;
}

//get book num, return -1 means not found, >=0 means the num of book available 
int getBookNum(string code,unordered_map<string, int> bookMap){
    int res;
    if (bookMap.find(code) != bookMap.end()) {
        res=bookMap[code];       
    } 
    else {
        res=-1;
    }
    return res;
}

int main() {   
    // open the txtfile and read
    ifstream file("history.txt");
    unordered_map<string, int> bookMap;
    string line;

    //read file line by line
    while (getline(file, line)) {
        stringstream ss(line);
        string key;
        int value;

        getline(ss, key, ',');
        ss >> value;
        bookMap[key] = value;
    }
    file.close();

    struct addrinfo hints, *servinfo, *p;
    int sockid;
    int rv;
    int recvnum,reponsenum;
    char buf[100];
    struct sockaddr_storage their_addr;
    socklen_t addr_len;

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
        cerr <<"talker: failed to create socket/n";
        return 2;
    }
    freeaddrinfo(servinfo);
    cout<<"ServerH is up and running using UDP on port 43328."<<"\n";



    //recv message from main server
    string code,user;
    int numberToSend;
    while(true){
        memset(buf, 0, sizeof(buf));
        memset(&their_addr, 0, sizeof(their_addr));
        addr_len=sizeof(their_addr);
        if((recvnum=recvfrom(sockid,buf,99,0,(struct sockaddr *)&their_addr, &addr_len))==-1){
            perror("rece from serverM");
            exit(1);
        }
        buf[recvnum]='\0';
        //cout<<buf<<endl;
        user=string(1,buf[0]);
        code=string(buf+1);
        //if user is student 
        if (user=="S"){
            cout<<"ServerH received "<<code<<" code from the Main Server."<<endl;    
            numberToSend = htonl(getBookAvail(code,bookMap));
            //send back answer
            if((reponsenum=sendto(sockid,&numberToSend,sizeof(numberToSend),0,(struct sockaddr *)&their_addr, sizeof(their_addr)))==-1){
                perror("reponse error");
                exit(1);
            }
            cout<<"ServerH finished sending the availability status of code "<< code<<" to the Main Server using UDP on port "<<MYPORT<<"."<<endl;          
        }
        //if user is admin
        else if(user=="A"){
            cout<<"ServerH received an inventory status request for code "<<code<<"."<<endl;
            numberToSend = htonl(getBookNum(code,bookMap));
            //send back answer
            if((reponsenum=sendto(sockid,&numberToSend,sizeof(numberToSend),0,(struct sockaddr *)&their_addr, sizeof(their_addr)))==-1){
                perror("reponse error");
                exit(1);
            }            
            cout<<"ServerH finished sending the inventory status to the Main server using UDP on port  "<<MYPORT<<"."<<endl;
        }

    }
    shutdown(sockid, SHUT_RDWR);
    close(sockid);

    return 0;

}