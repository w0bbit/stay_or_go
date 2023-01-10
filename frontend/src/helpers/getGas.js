import axios from 'axios'

export default async function getGas(zip_code) {
  zip_code = zip_code.padEnd(5, '0').slice(0,5)
  const url = 'https://www.gasbuddy.com/graphql'
  const params = {
    "operationName":"LocationBySearchTerm","variables":{"fuel":1,"search":`${zip_code}`},"query":"query LocationBySearchTerm($brandId: Int, $cursor: String, $fuel: Int, $lat: Float, $lng: Float, $maxAge: Int, $search: String){\nlocationBySearchTerm(lat: $lat, lng: $lng, search: $search) {\ncountryCode\ndisplayName\nlatitude\nlongitude\nregionCode\nstations(brandId: $brandId, cursor: $cursor, fuel: $fuel, maxAge: $maxAge){\ncount\ncursor {\nnext\n__typename\n}\nresults{\naddress {\ncountry\nline1\nline2\nlocality\npostalCode\nregion\n__typename\n}\nbadges {\nbadgeId\ncallToAction\ncampaignId\nclickTrackingUrl\ndescription\ndetailsImageUrl\ndetailsImpressionTrackingUrls\nimageUrl\nimpressionTrackingUrls\ntargetUrl\ntitle\n__typename\n}\nbrandings{\nbrand_id\nbranding_type\n__typename\n}\nbrands {\nbrand_id\nimage_url\nname\n__typename\n}\nemergency_status {\nhas_diesel {\nnick_name\nreport_status\nupdate_date\n__typename\n}\nhas_gas {\nnick_name\nreport_status\nupdate_date\n__typename\n}\nhas_power {\nnick_name\nreport_status\nupdate_date\n__typename\n}\n__typename\n}\nenterprise\nfuels\nid\nname\noffers{\ndiscounts {\ngrades\nhighlight\npwgbDiscount\nreceiptDiscount\n__typename\n}\nhighlight\nid\ntypes\nuse\n__typename\n}\npay_status {\nis_pay_available\n__typename\n}\nprices {\ncash {\nnickname\nposted_time\nprice\n__typename\n}\ncredit {\nnickname\nposted_time\nprice\n__typename\n}\ndiscount\nfuel_product\n__typename\n}\nratings_count\nstar_rating\n__typename\n}\n__typename\n}\ntrends {\nareaName\ncountry\ntoday\ntodayLow\ntrend\n__typename\n}\n__typename\n}\n}\n"}
  try {
    const response = await axios.post(url, params)
    const area_name = response.data.data.locationBySearchTerm.trends[0].areaName
    const average_gas = response.data.data.locationBySearchTerm.trends[0].today
    const res = {areaName: area_name, averageGas: average_gas}
    return(res.averageGas)
  } catch {
    const res = {areaName: null, averageGas: null}
    console.log('invalid input: ', zip_code, 'results: ', res)
    return(res)
  }
}