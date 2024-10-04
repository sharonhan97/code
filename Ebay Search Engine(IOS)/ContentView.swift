//
//  ContentView.swift
//  Project4 Ebay Search Engine
//
//  Created by 韩金哲 on 11/14/23.
//

import SwiftUI

struct ContentView: View {
    @State private var form=FormData()
    

    
    @State private var iscustom:Bool=false
    @State private var showzipsheet:Bool=false
    @State private var isUserInput:Bool=false
    @State private var showAlert:Bool=false
    @State private var showResult:Bool=false
    @State private var addfav:Bool=false
    @State private var removefav:Bool=false
    
    
    @ObservedObject var zipcodeService=Zipcode()
    @ObservedObject var wishlist=Wishlist()

    
    let cateoptions=["All","Art","Baby","Books","Clothing,Shoes & Accessories","Computers/Tablets & Networking","Health & Beauty","Music","Video Games & Consoles"]
    
    
    var body: some View {
        NavigationView{
            ZStack{
                List{
                    Section{
                        HStack{
                            Text("Keyword: ")
                            TextField("Required",text: $form.keywords)
                        }
                        HStack{
                            Text("Category")
                            Picker("",selection: $form.category){
                                ForEach(cateoptions,id: \.self){
                                    option in Text(option)
                                }
                            }
                            
                        }.tint(.blue)
                        VStack{
                            HStack{
                                Text("Condition")
                                    .frame(maxWidth: /*@START_MENU_TOKEN@*/.infinity/*@END_MENU_TOKEN@*/ ,alignment: .leading)
                            }
                            HStack{
                                Toggle(isOn:$form.conditionUsed){
                                    Text("Used")
                                }
                                .toggleStyle(CheckBox())
                                .padding(.leading,10)
                                Toggle(isOn:$form.conditionNew){
                                    Text("New")
                                }
                                .toggleStyle(CheckBox())
                                .padding(.leading,10)
                                Toggle(isOn:$form.conditionUnspecified){
                                    Text("Unspecified")
                                }
                                .toggleStyle(CheckBox())
                                .padding(.leading,10)
                            }
                        }
                        VStack{
                            HStack{
                                Text("Shipping")
                                    .frame(maxWidth: /*@START_MENU_TOKEN@*/.infinity/*@END_MENU_TOKEN@*/ ,alignment: .leading)
                            }
                            HStack{
                                Toggle(isOn:$form.shippingLocal){
                                    Text("Pickup")
                                }
                                .toggleStyle(CheckBox())
                                .padding(.leading,10)
                                Toggle(isOn:$form.shippingFree){
                                    Text("Free Shipping")
                                }
                                .toggleStyle(CheckBox())
                                .padding(.leading,20)
                            }
                        }
                        HStack{
                            Text("Distance: ")
                            TextField("10",text: $form.distance)
                        }
                        VStack{
                            Toggle(isOn:$iscustom){
                                Text("Custom Location")
                            }
                            if iscustom{
                                HStack{
                                    Text("Zipcode: ")
                                    TextField("Required",text: $form.zipcode,onEditingChanged: { isEditing in
                                        isUserInput = isEditing
                                    })
                                    .onChange(of:form.zipcode){newValue in
                                        if isUserInput{
                                            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                                                if newValue == self.form.zipcode {
                                                    zipcodeService.fetchZipcode(query: newValue)
                                                    showzipsheet = true
                                                    isUserInput=false
                                                }
                                            }
                                            
                                        }
                                    }
                                }
                            }
                        }.sheet(isPresented: $showzipsheet){
                            SheetView(zipcode:zipcodeService.zipCodes,selectedzipcode: $form.zipcode,showsheet: $showzipsheet)
                            
                        }
                        HStack(){
                            Spacer()
                            Text("Submit")
                            .background(Color.blue)
                            .foregroundStyle(Color.white)
                            .frame(width: 100,height: 45)
                            .background(RoundedRectangle(cornerRadius: 10).fill(Color.blue))
                            .onTapGesture {
                                print("submit")
                                if form.keywords.trimmingCharacters(in: .whitespaces).isEmpty{
                                    showAlert=true
                                }
                                else{
                                    showAlert=false
                                    showResult=true
                                    zipcodeService.fetchEbayResult(data: form)
                                }
                            }
                            Text("Clear")
                                .background(Color.blue)
                                .frame(width: 100,height: 45)
                                .background(RoundedRectangle(cornerRadius: 10).fill(Color.blue))
                                .foregroundStyle(Color.white)
                                .padding(.leading,20)
                                .contentShape(Rectangle())
                                .onTapGesture{
                                    print("clear")
                                    form=FormData()
                                    iscustom=false
                                    showzipsheet=false
                                    isUserInput=false
                                    showAlert=false
                                    showResult=false
                                    zipcodeService.resultDataReady=false
                                }
                            Spacer()
                        }
                    
                }
                    if showResult{
                        Section{
                            Text("Results")
                                .font(.title)
                                .bold()
                                .padding(.vertical,2)
                            if !zipcodeService.resultDataReady{
                                VStack(alignment:.center){
                                    ProgressView("Please wait...")
                                        .progressViewStyle(CircularProgressViewStyle(tint: Color.gray))
                                        .id(UUID())
                                }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
                            }
                            if zipcodeService.resultDataReady==true && zipcodeService.results.isEmpty{
                                Text("No results found.")
                                    .foregroundStyle(Color(.red))
                            }
                            ForEach(zipcodeService.results,id:\.id){ result in
                                NavigationLink(destination: DetailView(result:result,wishlist:wishlist)) {
                                    HStack{
                                        if let urlString = result.img, let url = URL(string: urlString) {
                                            AsyncImage(url: url) { phase in
                                                switch phase {
                                                case .success(let image):
                                                    image.resizable()
                                                        .frame(width: 80, height: 80)
                                                        .cornerRadius(7)
                                                case .failure(_):
                                                    Text("no photo")
                                                default:
                                                    ProgressView()
                                                }
                                            }
                                        } else {
                                            Text("no photo")
                                        }
                                        VStack(alignment: .leading){
                                            if let title=result.title{
                                                Text(title)
                                                    .lineLimit(1)
                                                    .truncationMode(.tail)
                                            }
                                            if let price=result.price{
                                                Text("$\(price)")
                                                    .foregroundStyle(Color(.blue))
                                            }
                                            if let shipping=result.shipping{
                                                if shipping=="0.0"{
                                                    Text("Free Shipping")
                                                        .foregroundStyle(Color(.gray))
                                                }
                                                else{
                                                    Text("$\(shipping)")
                                                        .foregroundStyle(Color(.gray))
                                                }
                                            }
                                            HStack{
                                                if let zipcode=result.zipcode{
                                                    Text(zipcode)
                                                        .foregroundStyle(Color(.gray))
                                                }
                                                Spacer()
                                                if let condition=result.condition{
                                                    Text(condition)
                                                        .foregroundStyle(Color(.gray))
                                                }
                                                
                                            }
                                            
                                            
                                            
                                        }
                                        Image(systemName: wishlist.wishlist.contains(result.itemId!) ? "heart.fill" : "heart")
                                            .foregroundStyle(Color.red)
                                            .onTapGesture {
                                                if wishlist.wishlist.contains(result.itemId!) {
                                                    wishlist.deletewish(itemId: result.itemId!)
                                                    removefav=true
                                                } else {
                                                    wishlist.addwish(item: result)
                                                    addfav=true
                                                }
                                            }
                                        
                                    }
                                }
                            }
                            
                        }
                    }
                }
                .navigationTitle("Product Search")
                if showAlert {
                    VStack {
                        Spacer()
                        Text("Keyword is mandatory")
                            .foregroundColor(.white)
                            .frame(width: 230,height:50)
                            .background(Color.black)
                            .cornerRadius(7)
                            .padding(.bottom, 7)
                            .padding(.horizontal,3)
                            .font(.system(size: 20))
                    }
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                            self.showAlert = false
                        }
                    }
                }
                
                if addfav{
                    VStack {
                        Spacer()
                        Text("Added to favorites")
                            .foregroundColor(.white)
                            .frame(width: 200,height:50)
                            .background(Color.black)
                            .cornerRadius(7)
                            .padding(.bottom, 7)
                            .padding(.horizontal,3)
                            .font(.system(size: 20))
                    }
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                            self.addfav = false
                        }
                    }
                }
                
                if removefav{
                    VStack {
                        Spacer()
                        Text("Removed from favorites")
                            .foregroundColor(.white)
                            .frame(width: 260,height:50)
                            .background(Color.black)
                            .cornerRadius(7)
                            .padding(.bottom, 7)
                            .padding(.horizontal,3)
                            .font(.system(size: 20))
                    }
                    .onAppear {
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                            self.removefav = false
                        }
                    }
                }
                
                
        }
            .onAppear{
                zipcodeService.fetchCurrentZipcode();
            }
            .navigationBarItems(trailing: Favorites(wishlist: wishlist))
        }
        

            
        

        
    }
    


}

struct Favorites:View {
    @ObservedObject var wishlist:Wishlist
    
    var body: some View {
        NavigationLink(destination: Favorite(wishlist:wishlist) ){
            Image(systemName: "heart.circle")
                .foregroundColor(Color.blue)
        }
    }
}

struct FormData{
    var keywords:String=""
    var category:String="All"
    var conditionUsed:Bool=false
    var conditionNew:Bool=false
    var conditionUnspecified:Bool=false
    var shippingLocal:Bool=false
    var shippingFree:Bool=false
    var distance:String=""
    var zipcode:String=""
    
}

struct SheetView:View{
    var zipcode:[String]
    @Binding var selectedzipcode:String
    @Binding var showsheet:Bool
    
    var body: some View {
        NavigationView {
            List(zipcode, id: \.self) { zip in
                Button(zip) {
                    self.selectedzipcode = zip
                    self.showsheet=false
                }
            }
            .navigationTitle("Pincode suggestions")
        }
    }
}

struct CheckBox:ToggleStyle{
    func makeBody(configuration: Configuration) -> some View {
        HStack {
            RoundedRectangle(cornerRadius: 5.0)
                .stroke(configuration.isOn ? Color.blue : Color.gray, lineWidth: 1.5)
                .background(RoundedRectangle(cornerRadius: 3).fill(configuration.isOn ? Color.blue : Color.white))
                .frame(width: 16, height: 16)
                .cornerRadius(5.0)
                .overlay {
                    Image(systemName: configuration.isOn ? "checkmark" : "")
                        .foregroundColor(.white)
                        .font(.system(size: 10))
                }
                .onTapGesture {
                    configuration.isOn.toggle()
                }
 
            configuration.label
 
        }
    }
}

#Preview {
    ContentView()
}
