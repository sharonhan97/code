# Compiler and compile options
CXX = g++
CXXFLAGS = -std=c++11 -Wall

# Targets and object files
TARGETS = serverM serverS serverL serverH client
OBJS = main.o serverM.o serverS.o serverL.o serverH.o client.o

# Build rules
all: $(TARGETS)

serverM: serverM.o
	$(CXX) serverM.o -o serverM

serverS: serverS.o
	$(CXX) serverS.o -o serverS

serverL: serverL.o
	$(CXX) serverL.o -o serverL

serverH: serverH.o
	$(CXX) serverH.o -o serverH

client: client.o
	$(CXX) client.o -o client

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -f $(OBJS) $(TARGETS)