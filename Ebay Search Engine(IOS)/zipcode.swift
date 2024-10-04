import Combine
import SwiftUI
import SwiftyJSON

struct Result:Identifiable, Codable{
    var id = UUID()
    var img:String?
    var title:String?
    var price:String?
    var shipping:String?
    var zipcode:String?
    var itemId:String?
    var condition:String?
    var url:String?
}

class Zipcode: ObservableObject {
    @Published var zipCodes: [String] = []
    @Published var results:[Result]=[]
    var cancellationToken: AnyCancellable?
    var currzipcode:String=""
    @Published var resultDataReady:Bool=false
    
    
    func fetchZipcode(query: String) {
        guard let url=URL(string: "https://hw4jg24ighyo.wl.r.appspot.com/api/zipcode?enter=\(query)")else{
            print("wrong url")
            return
        }
        let request=URLRequest(url:url)
        let task=URLSession.shared.dataTask(with: request){data, response, error in
            if let error = error{
                print("Error fetch zipcode",error)
                return
            }
            guard let data=data else{
                print ("No data in response")
                return
            }
            do {
                let decoder=JSONDecoder()
                let zipcode = try decoder.decode([String].self,from:data)
                DispatchQueue.main.async {
                    self.zipCodes=zipcode
                }
                
            }
            catch{
                print("wrong decode zipcode data")
            }
            
        }
        task.resume()
    }
    
    
    func fetchCurrentZipcode(){
        struct zipcodeResponse:Codable{
            var postal:String
        }
        
        guard let url=URL(string:"https://ipinfo.io/json?token=18acdfdd7434e7")else{
            print("wrong url")
            return
        }
        let request=URLRequest(url:url)
        let task=URLSession.shared.dataTask(with: request){data, response, error in
            if let error = error{
                print("Error fetch zipcode",error)
                return
            }
            guard let data=data else{
                print ("No data in response")
                return
            }
            do {
                let decoder=JSONDecoder()
                let data = try decoder.decode(zipcodeResponse.self,from:data)
                DispatchQueue.main.async {
                    self.currzipcode=data.postal
                    
                }
                
            }
            catch{
                print("wrong decode zipcode data")
            }
            
        }
        task.resume()
    }
    
    

    func fetchEbayResult(data: FormData) {
        self.results=[]
        var updatedData=data
        
        if updatedData.zipcode.isEmpty{
            updatedData.zipcode=self.currzipcode
        }
        
        if updatedData.category=="Clothing,Shoes & Accessories"{
            updatedData.category="Clothing"
        }
        if updatedData.category=="Computers/Tablets & Networking"{
            updatedData.category="Computers"
        }
        if updatedData.category=="Health & Beauty"{
            updatedData.category="Health"
        }
        if updatedData.category=="Video Games & Consoles"{
            updatedData.category="VideoGame"
        }

        
        var components = URLComponents()
        components.scheme = "https"
        components.host = "hw4jg24ighyo.wl.r.appspot.com"
        components.path = "/api/ebay"
        components.queryItems = [
            URLQueryItem(name: "keywords", value: updatedData.keywords),
            URLQueryItem(name: "category", value: updatedData.category),
            URLQueryItem(name: "conditionUsed", value: String(updatedData.conditionUsed)),
            URLQueryItem(name: "conditionNew", value: String(updatedData.conditionNew)),
            URLQueryItem(name: "conditionUnspecified", value: String(updatedData.conditionUnspecified)),
            URLQueryItem(name: "shippingLocal", value: String(updatedData.shippingLocal)),
            URLQueryItem(name: "shippingFree", value: String(updatedData.shippingFree)),
            URLQueryItem(name: "distance", value: String(updatedData.distance)),
            URLQueryItem(name: "zipcode", value: updatedData.zipcode)
        ]
        
        guard let url=components.url else{
            print("wrong url")
            return
        }
        print(url)
        let request=URLRequest(url:url)
        let task=URLSession.shared.dataTask(with: request){data, response, error in
            if let error = error{
                print("Error fetch zipcode",error)
                return
            }
            do {
                if let data = data,
                   let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    self.processEbayResult(data: json)
                    DispatchQueue.main.async {
                        self.resultDataReady=true
                    }
                }
                
            }
            catch{
                print("wrong decode zipcode data")
            }
            
        }
        task.resume()
    }
    
    func processEbayResult(data:[String:Any]){
        let jsondata=JSON(data)
        let items = jsondata["findItemsAdvancedResponse"][0]["searchResult"][0]["item"].arrayValue
        let num = jsondata["findItemsAdvancedResponse"][0]["searchResult"][0]["@count"].stringValue
        if num != "0"{
            for item in items{
                var result=Result()
                var conditionId:String
                result.img = item["galleryURL"][0].stringValue
                result.title = item["title"][0].stringValue
                result.price=item["sellingStatus"][0]["currentPrice"][0]["__value__"].stringValue
                result.shipping = item["shippingInfo"][0]["shippingServiceCost"][0]["__value__"].stringValue
                result.zipcode = item["postalCode"][0].stringValue
                result.itemId = item["itemId"][0].stringValue
                result.url = item["viewItemURL"][0].stringValue
                conditionId = item["condition"][0]["conditionId"][0].stringValue
                if conditionId=="1000"{
                    result.condition="NEW"
                }
                else if conditionId=="2000" || conditionId=="2500"{
                    result.condition="REFURBISHED"
                }
                else if conditionId=="3000" || conditionId=="4000" || conditionId=="5000" || conditionId=="6000"{
                    result.condition="USED"
                }
                else{
                    result.condition="NA"
                }
                self.results.append(result)
            }
        }
    }
    
    
}
