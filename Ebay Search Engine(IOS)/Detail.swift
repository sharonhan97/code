//
//  Detail.swift
//  Project4 Ebay Search Engine
//
//  Created by 韩金哲 on 11/19/23.
//

import Foundation
import Combine
import SwiftUI
import SwiftyJSON

class Detail:ObservableObject{
    @Published var detail=Info()
    @Published var detailDataReady:Bool=false
    @Published var photo:[UIImage]=[]
    @Published var photoReady:Bool=false
    @Published var similar:[Similar]=[]
    @Published var similarReady:Bool=false
    
    struct Info:Identifiable{
        let id = UUID()
        var title:String?
        var images:[String]?
        var price:Float = 0.0
        var location:String?
        var spec:[Spec] = []
        var sell = Seller()
        var ship = Ship()
        var returninfo = Return()
    }
    
    struct Spec{
        var name:String
        var value:String
    }
    
    struct Seller{
        var storeName:String?
        var storeUrl:String?
        var feedback:String?
        var popularity:String?
    }
    
    struct Ship{
        var global:Bool?
        var handleTime:Int?
    }
    
    struct Return{
        var policy:String?
        var refundMode:String?
        var refundTime:String?
        var shipCostPaid:String?
    }
    
    struct Similar:Identifiable{
        let id = UUID()
        var image:String?
        var title:String?
        var price:Float=0.0
        var ship:Float=0.0
        var day:Int=0
    }
    
    
    func fetchDetail(itemId: String) {
        guard let url=URL(string: "https://hw4jg24ighyo.wl.r.appspot.com/api/detail?itemId=\(itemId)")else{
            print("wrong url")
            return
        }
        let request=URLRequest(url:url)
        let task=URLSession.shared.dataTask(with: request){data, response, error in
            if let error = error{
                print("Error fetch zipcode",error)
                return
            }
            do {
                if let data = data,
                   let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    self.processEbayDetail(data: json)
                }
                
            }
            catch{
                print("wrong decode detail data")
            }
            
        }
        task.resume()
    }
    
    func processEbayDetail(data:[String:Any]){
        let jsondata=JSON(data)
        let item = jsondata["Item"]
        if let pictureURLs = item["PictureURL"].arrayObject as? [String] {
            self.detail.images = pictureURLs
            print(pictureURLs)
        }
        self.detail.price = item["ConvertedCurrentPrice"]["Value"].floatValue
        self.detail.title = item["Title"].stringValue
        self.detail.location = item["Location"].stringValue
        self.detail.sell.feedback = item["Seller"]["FeedbackScore"].stringValue
        self.detail.sell.popularity = item["Seller"]["PositiveFeedbackPercent"].stringValue
        self.detail.sell.storeName = item["Storefront"]["StoreName"].stringValue
        self.detail.sell.storeUrl = item["Storefront"]["StoreURL"].stringValue
        self.detail.ship.global = item["GlobalShipping"].boolValue
        self.detail.ship.handleTime = item["HandlingTime"].intValue
        self.detail.returninfo.policy = item["ReturnPolicy"]["ReturnsAccepted"].stringValue
        self.detail.returninfo.refundMode = item["ReturnPolicy"]["Refund"].stringValue
        self.detail.returninfo.refundTime = item["ReturnPolicy"]["ReturnsWithin"].stringValue
        self.detail.returninfo.shipCostPaid = item["ReturnPolicy"]["ShippingCostPaidBy"].stringValue
        
                                      
        self.detail.spec=[]
        if let itemSpecifics = item["ItemSpecifics"]["NameValueList"].array {
            for item in itemSpecifics {
                if let name = item["Name"].string,
                   let value = item["Value"].array?.first?.string {
                    let specItem = Spec(name:name,value: value)
                    self.detail.spec.append(specItem)
                }
            }
        }
        DispatchQueue.main.async {
            self.detailDataReady = true
        }
    }
    
    func fetchPhoto(title: String) {
        guard let url=URL(string: "https://hw4jg24ighyo.wl.r.appspot.com/api/photo?title=\(title)")else{
            print("wrong url")
            return
        }
        let request=URLRequest(url:url)
        let task=URLSession.shared.dataTask(with: request){data, response, error in
            if let error = error{
                print("Error fetch zipcode",error)
                return
            }
            do {
                if let data = data,
                   let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    self.processPhoto(data: json)
                }
                
            }
            catch{
                print("wrong decode zipcode data")
            }
            
        }
        task.resume()
    }
    
    func processPhoto(data:[String:Any]){
        let jsondata=JSON(data)
        self.photo=[]
        let group=DispatchGroup()
        if let items = jsondata["items"].array{
            for item in items{
                guard let url = URL(string: item["link"].string!) else { return }
                group.enter()
                URLSession.shared.dataTask(with: url) { data, _, _ in
                    defer { group.leave() }
                    if let data = data, let image = UIImage(data: data) {
                        self.photo.append(image)
                    }
                }.resume()
            }
            group.notify(queue: .main) {
                self.photoReady = true
            }
        }

    }
    
    func fetchSimilar(itemId: String) {
        guard let url=URL(string: "https://hw4jg24ighyo.wl.r.appspot.com/api/similar?itemId=\(itemId)")else{
            print("wrong url")
            return
        }
        let request=URLRequest(url:url)
        let task=URLSession.shared.dataTask(with: request){data, response, error in
            if let error = error{
                print("Error fetch zipcode",error)
                return
            }
            do {
                if let data = data,
                   let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    self.processSimilar(data: json)
                }
                
            }
            catch{
                print("wrong decode zipcode data")
            }
            
        }
        task.resume()
    }
    
    func processSimilar(data:[String:Any]){
        let jsondata=JSON(data)
        self.similar=[]
        if let items=jsondata["getSimilarItemsResponse"]["itemRecommendations"]["item"].array{
            for item in items{
                var s=Similar()
                s.image=item["imageURL"].stringValue
                s.title=item["title"].stringValue
                s.price=Float(item["buyItNowPrice"]["__value__"].stringValue) ?? 0.0
                s.ship=Float(item["shippingCost"]["__value__"].stringValue) ?? 0.0
                let dayleft = item["timeLeft"].stringValue
                let regex = try! NSRegularExpression(pattern: "P(\\d+)D")
                if let match = regex.firstMatch(in: dayleft, options: [], range: NSRange(dayleft.startIndex..., in: dayleft)) {
                    let dayRange = Range(match.range(at: 1), in: dayleft)!
                    s.day = Int(dayleft[dayRange]) ?? 0
                }
                self.similar.append(s)
            }
            DispatchQueue.main.async {
                self.similarReady=true
            }
            print(self.similar)
        }
    }
}
