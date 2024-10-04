//
//  DetailView.swift
//  Project4 Ebay Search Engine
//
//  Created by 韩金哲 on 11/20/23.
//

import SwiftUI

struct DetailView: View {
    var result:Result
    @ObservedObject var wishlist:Wishlist
    
    @State private var selectedTab = "Info"
    
    @StateObject var detailService=Detail()
    
    var body: some View {
                TabView(selection: $selectedTab){
                    InfoView(detailService:detailService,itemId: result.itemId!)
                        .tabItem {
                            Image(systemName: "info.circle.fill")
                            Text("Info")
                        }
                        .tag("Info")
                        .padding(.top, 50)
                    
                    
                    
                    ShippingView(detailService:detailService,shipcost: result.shipping!)
                        .tabItem {
                            Image(systemName: "shippingbox.fill")
                            Text("Shipping")
                        }
                        .tag("Shipping")
                        .padding(.top, 50)
                    
                    
                    PhotosView(detailService:detailService,title: result.title!)
                        .tabItem {
                            Image(systemName: "photo.on.rectangle.angled")
                            Text("Photos")
                        }
                        .tag("Photos")
                        .padding(.top, 30)
                    
                    
                    SimilarView(detailService:detailService,itemId: result.itemId!)
                        .tabItem {
                            Image(systemName: "list.bullet.indent")
                            Text("Similar")
                        }
                        .tag("Similar")
                        .padding(.top, 10)
                        
                    
                    
                }
                .navigationBarTitleDisplayMode(.inline)
                .navigationBarItems(trailing:
                                TopIcon(wishlist: wishlist,result: result)
        )



    }
}

struct TopIcon: View {
    @ObservedObject var wishlist:Wishlist
    var result:Result
    
    var body: some View {
        HStack{
            Image("fb")
                .resizable()
                .frame(width: 25,height: 25)
                .onTapGesture {
                    if let productURL = URL(string:result.url!),
                       let shareURL = URL(string: "https://www.facebook.com/sharer/sharer.php?u=\(productURL.absoluteString)") {
                        UIApplication.shared.open(shareURL)
                    }

                }
                .padding(.horizontal,3)
            Image(systemName: wishlist.wishlist.contains(result.itemId!) ? "heart.fill" : "heart")
                .foregroundStyle(Color.red)
                .onTapGesture {
                    if wishlist.wishlist.contains(result.itemId!) {
                        wishlist.deletewish(itemId: result.itemId!)
                    } else {
                        wishlist.addwish(item: result)
                    }
                }
        }
    }
}

struct CarouselView: View {
    var detailService:Detail

    var body: some View {
        TabView{
                if let images = detailService.detail.images{
                    ForEach(images, id: \.self) { imageUrl in
                        AsyncImage(url: URL(string: imageUrl)) { image in
                            image
                                .resizable()
                                .scaledToFit()
                        } placeholder: {
                            Color.gray
                        }
                            
                    }
                }
        }
        .tabViewStyle(PageTabViewStyle())
        .frame(width: 300, height: 250)
    }
}

struct InfoView: View {
    @ObservedObject var detailService:Detail
    var itemId:String
    
    var body: some View {
        VStack{
            if detailService.detailDataReady == false{
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .gray))
                    .frame(maxWidth:.infinity, alignment: .center)
                    .id(UUID())
            }
            else{
                VStack{
                    CarouselView(detailService:detailService)
                    Text(detailService.detail.title!)
                        .padding(.bottom, 4)
                        .frame(maxWidth:.infinity, alignment: .leading)
                    Text("$\(detailService.detail.price, specifier: "%.2f")")
                        .frame(maxWidth:.infinity, alignment: .leading)
                        .foregroundColor(/*@START_MENU_TOKEN@*/.blue/*@END_MENU_TOKEN@*/)
                        .padding(.bottom,6)
                    HStack{
                        Image(systemName: "magnifyingglass")
                        Text("Description")
                    }
                    .frame(maxWidth:.infinity, alignment: .leading)
                    .padding(.bottom,10)
                    ScrollView{
                        VStack(spacing:0){
                            ForEach(detailService.detail.spec, id: \.name){ item in
                                HStack{
                                    Text(item.name)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                    Spacer()
                                    Text(item.value)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                }
                                .padding(0)
                                .background(Color.white)
                                .overlay(
                                    Rectangle()
                                        .frame(height: 1)
                                        .foregroundStyle(Color.gray),
                                    alignment: .top
                                )
                                .listRowInsets(EdgeInsets())
                                .listRowBackground(Color.clear)
                            }
                            
                        }
                    }
                }.padding(.horizontal,16)
            }
        }
        .onAppear{
            detailService.fetchDetail(itemId: itemId)
        }
    }
}

struct ShippingView: View {
    @ObservedObject var detailService:Detail
    var shipcost:String
    @State private var showProgress = true
    
    var body: some View {
        VStack{
            if !showProgress{
                VStack{
                    if detailService.detail.sell.storeName != nil || detailService.detail.sell.feedback != nil ||
                        detailService.detail.sell.popularity != nil  ||
                        (detailService.detail.sell.storeUrl != nil) {
                        VStack{
                            HStack{
                                Image(systemName: "storefront")
                                Text("Seller")
                            }
                            .frame(maxWidth:.infinity, alignment: .leading)
                            .padding(.vertical,10)
                            .overlay(
                                VStack {
                                    Divider().background(Color.gray).frame(height: 2)
                                    Spacer()
                                    Divider().background(Color.gray)
                                },
                                alignment: .topLeading
                            )
                            VStack{
                                if let storename=detailService.detail.sell.storeName, let urlString=detailService.detail.sell.storeUrl, let url=URL(string: urlString){
                                    HStack{
                                        Text("Store Name")
                                            .frame(maxWidth: .infinity, alignment: .center)
                                        Spacer()
                                        Link(storename, destination: url)
                                            .frame(maxWidth: .infinity, alignment: .center)
                                    }
                                }
                                if let feedback=detailService.detail.sell.feedback{
                                    HStack{
                                        Text("Feedback Score")
                                            .frame(maxWidth: .infinity, alignment: .center)
                                        Spacer()
                                        Text(feedback)
                                            .frame(maxWidth: .infinity, alignment: .center)
                                    }
                                }
                                if let popularity=detailService.detail.sell.popularity{
                                    HStack{
                                        Text("Popularity")
                                            .frame(maxWidth: .infinity, alignment: .center)
                                        Spacer()
                                        Text("$"+String(format: "%.2f", Float(popularity) ?? 0.00))
                                            .frame(maxWidth: .infinity, alignment: .center)
                                    }
                                }
                            }
                        }
                        
                    }
                    
                    VStack{
                        HStack{
                            Image(systemName: "sailboat")
                            Text("Shipping Info")
                        }
                        .frame(maxWidth:.infinity, alignment: .leading)
                        .padding(.vertical,10)
                        .overlay(
                            VStack {
                                Divider().background(Color.gray)
                                Spacer()
                                Divider().background(Color.gray)
                            },
                            alignment: .topLeading
                        )
                        VStack{
                            HStack{
                                Text("Shipping Cost")
                                    .frame(maxWidth: .infinity, alignment: .center)
                                Spacer()
                                if shipcost=="0.0"{
                                    Text("Free Shipping")
                                        .frame(maxWidth: .infinity, alignment: .center)
                                }
                                else{
                                    Text(shipcost)
                                        .frame(maxWidth: .infinity, alignment: .center)
                                }
                                
                            }
                            if let global=detailService.detail.ship.global{
                                HStack{
                                    Text("Global Shipping")
                                        .frame(maxWidth: .infinity, alignment: .center)
                                    Spacer()
                                    if global == true{
                                        Text("Yes")
                                            .frame(maxWidth: .infinity, alignment: .center)
                                    }
                                    else{
                                        Text("No")
                                            .frame(maxWidth: .infinity, alignment: .center)
                                    }
                                }
                            }
                            if let time=detailService.detail.ship.handleTime{
                                HStack{
                                    Text("Handling Time")
                                        .frame(maxWidth: .infinity, alignment: .center)
                                    Spacer()
                                    Text("\(time) day")
                                        .frame(maxWidth: .infinity, alignment: .center)
                                }
                            }
                        }
                    }
                    
                    if detailService.detail.returninfo.policy != nil ||
                        detailService.detail.returninfo.refundMode != nil ||
                        detailService.detail.returninfo.refundTime != nil ||
                        detailService.detail.returninfo.shipCostPaid != nil{
                        VStack{
                            HStack{
                                Image(systemName: "return")
                                Text("Return Policy")
                            }
                            .frame(maxWidth:.infinity, alignment: .leading)
                            .padding(.vertical,10)
                            .overlay(
                                VStack {
                                    Divider().background(Color.gray)
                                    Spacer()
                                    Divider().background(Color.gray)
                                },
                                alignment: .topLeading
                            )
                            VStack{
                                if let policy = detailService.detail.returninfo.policy{
                                    HStack{
                                        Text("Policy")
                                            .frame(maxWidth: .infinity, alignment: .center)
                                        Spacer()
                                        Text(policy)
                                            .frame(maxWidth: .infinity, alignment: .center)
                                    }
                                }
                                if let mode = detailService.detail.returninfo.refundMode, !mode.isEmpty{
                                    HStack{
                                        Text("Refund Mode")
                                            .frame(maxWidth: .infinity, alignment: .center)
                                        Spacer()
                                        Text(mode.components(separatedBy: "(").first!.trimmingCharacters(in: .whitespacesAndNewlines))
                                            .frame(maxWidth: .infinity, alignment: .center)
                                    }
                                    
                                }
                                if let with = detailService.detail.returninfo.refundTime, !with.isEmpty{
                                    HStack{
                                        Text("Refund Within")
                                            .frame(maxWidth: .infinity, alignment: .center)
                                        Spacer()
                                        Text("\(with)")
                                            .frame(maxWidth: .infinity, alignment: .center)
                                    }
                                }
                                if let by = detailService.detail.returninfo.shipCostPaid, !by.isEmpty{
                                    HStack{
                                        Text("Shipping Cost Paid By")
                                            .frame(maxWidth: .infinity, alignment: .center)
                                        Spacer()
                                        Text(by)
                                            .frame(maxWidth: .infinity, alignment: .center)
                                    }
                                }
                                
                            }
                        }
                    }
                    
                    Spacer()
                }
                
                
                
            }
            else{
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .gray))
                    .frame(maxWidth:.infinity, alignment: .center)
            }
        }
        .onAppear{
            DispatchQueue.main.asyncAfter(deadline: .now()+0.3){
                showProgress=false
            }
        }
    }
}

struct PhotosView:View {
    @ObservedObject var detailService:Detail
    var title:String
    
    var body: some View {
        VStack{
            if !detailService.photoReady {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .gray))
                    .frame(maxWidth:.infinity, alignment: .center)
            }
            else{
                VStack{
                    HStack{
                        Text("Powered by ")
                        Image("google").resizable()
                            .frame(width: 100,height: 30)
                            .padding()
                    }
                    ScrollView{
                        ForEach(detailService.photo,id:\.self){ img in
                            Image(uiImage: img)
                                .resizable()
                                .frame(width: 250, height: 250)
                                .cornerRadius(7)
                        }
                    }
                    
                }
            }

        }
        .onAppear{
            detailService.fetchPhoto(title: title)
        }
    }
}

struct SimilarView:View {
    @ObservedObject var detailService:Detail
    var itemId:String
    @State private var sort:String="Default"
    @State private var order:String="Ascending"
    
    let columns: [GridItem] = [
        GridItem(.flexible(), spacing: 20),
        GridItem(.flexible(), spacing: 20)
    ]
    
    var body: some View {
        VStack{
            if detailService.similarReady == false {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .gray))
                    .frame(maxWidth:.infinity, alignment: .center)
            }
            else{
                VStack{
                    Text("Sort By")
                        .frame(maxWidth: .infinity,alignment:.leading)
                        .font(.title2)
                        .bold()
                        
                    
                    Picker("Sort By", selection: $sort) {
                        Text("Default").tag("Default")
                        Text("Name").tag("Name")
                        Text("Price").tag("Price")
                        Text("Days Left").tag("Days")
                        Text("Shipping").tag("Shipping")
                    }
                    .pickerStyle(SegmentedPickerStyle())
                    .padding(.bottom,20)
                    
                     if sort != "Default" {
                             Text("Order")
                                 .frame(maxWidth: .infinity,alignment:.leading)
                                 .font(.title2)
                                 .bold()
                             
                             Picker("Order", selection: $order) {
                                 Text("Ascending").tag("Ascending")
                                 Text("Descending").tag("Descending")
                             }
                             .pickerStyle(SegmentedPickerStyle())
                             .padding(.bottom,20)
                         
                        
                    }

                    
                    let sortedItems = detailService.similar.sorted {
                        switch sort {
                        case "Name":
                            return order == "Ascending" ? $0.title! < $1.title!: $0.title! > $1.title!
                        case "Price":
                            return order == "Ascending" ? $0.price < $1.price : $0.price > $1.price
                        case "Days":
                            return order == "Ascending" ? $0.day < $1.day : $0.day > $1.day
                        case "Shipping":
                            return order == "Ascending" ? $0.ship < $1.ship : $0.ship > $1.ship
                        default:
                            return true
                        }
                    }
                    
                    ScrollView{
                        LazyVGrid(columns: columns){
                            ForEach(sortedItems,id: \.id){ item in
                                VStack{
                                    VStack{
                                        if let urlString = item.image,
                                           let url = URL(string: urlString) {
                                            AsyncImage(url: url) { phase in
                                                switch phase {
                                                case .success(let image):
                                                    image.resizable()
                                                        .frame(width: 165, height: 165)
                                                        .cornerRadius(10.0)
                                                        .padding(.bottom,13)
                                                case .failure(_):
                                                    Text("no photo")
                                                default:
                                                    ProgressView()
                                                }
                                            }
                                        } else {
                                            Text("no photo")
                                        }
                                        Text(item.title!)
                                            .lineLimit(/*@START_MENU_TOKEN@*/2/*@END_MENU_TOKEN@*/)
                                            .padding(.horizontal,10)
                                            .padding(.bottom,3)
                                        HStack{
                                            Text("$"+String(format: "%.2f", item.ship))
                                                .font(.system(size: 12))
                                                .foregroundStyle(Color(.gray))
                                            Spacer()
                                            Text("\(item.day) days left")
                                                .font(.system(size: 12))
                                                .foregroundStyle(Color(.gray))
                                        }
                                        .padding(.horizontal,5)
                                        HStack{
                                            Spacer()
                                            Text("$"+String(format: "%.2f", item.price))
                                                .foregroundStyle(Color.blue)
                                        }
                                        .padding(.horizontal,5)
                                        .padding(.top,3)
                                        
                                    }
                                }
                                .padding(.horizontal,5)
                                .padding(.top,10)
                                .padding(.bottom,20)
                                .background(Color.gray.opacity(0.1))
                                .cornerRadius(10.0)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(Color.gray, lineWidth: 1)
                                )
                                


                                
                            }
                            
                        }
                    }
                    
                    
                }
                .padding(.horizontal,10)
                .padding(.top,0)
                
            }
            
        }
        .onAppear{
            detailService.fetchSimilar(itemId: itemId)
        }

        
    }
}


