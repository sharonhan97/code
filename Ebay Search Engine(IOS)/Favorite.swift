//
//  Favorite.swift
//  Project4 Ebay Search Engine
//
//  Created by 韩金哲 on 11/22/23.
//

import SwiftUI

struct Favorite: View {
    @ObservedObject var wishlist:Wishlist
    @State var totalprice:Float=0.0
    

    
    var body: some View {
            VStack{
                if wishlist.isReady == false {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .gray))
                        .frame(maxWidth:.infinity, alignment: .center)
                }
                else{
                    if wishlist.list.isEmpty{
                        Text("No items in wishlist")
                    }
                    else{
                        List{
                            HStack{
                                Text("Wishlist total(\(wishlist.totalnum)) items:")
                                Spacer()
                                Text("$"+String(format: "%.2f", wishlist.totalprice))
                            }
                            ForEach(wishlist.list,id:\.id){result in
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
                                }
                            }.onDelete(perform: { indexSet in
                                for index in indexSet{
                                    let deletedItem = wishlist.list[index]
                                    wishlist.deletewish(itemId: deletedItem.itemId!)
                                    wishlist.totalnum -= 1
                                    wishlist.totalprice -= Float(deletedItem.price!) ?? 0.0
                                }
                                
                                wishlist.list.remove(atOffsets: indexSet)
                            })
                            
                        }
                    }

                }
            }
            .onAppear{wishlist.getwish()}
            .navigationTitle("Favorites")
        
        
        
    }

}

