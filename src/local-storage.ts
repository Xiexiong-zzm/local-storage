/**
 * 使用 html5 提供的 localStorage来缓存数据
 **/
 const SPLIT_STR = '@'
 const localStorage = window.localStorage
 
 const DATA_PROCESS_MAPPING = {
     number: {
         save: (data: number) => data,
         parse: (data: string) => Number.parseFloat(data)
     },
     boolean: {
         save: (data: boolean) => data,
         parse: (data: string) => JSON.parse(data)
     },
     object: {
         save: (data: any) => JSON.stringify(data),
         parse: (data: string) => JSON.parse(data)
     },
     default: {
         save: (data: any) => data,
         parse: (data: any) => data
     }
 }
 
 function getProcess(type: any) {
     return (
         DATA_PROCESS_MAPPING[type as keyof typeof DATA_PROCESS_MAPPING] ||
         DATA_PROCESS_MAPPING.default
     )
 }
 
 export default {
     get(key: string) {
         try {
             const stringData = localStorage.getItem(key)
             if (stringData) {
                 const dataArray = stringData.split('@')
                 const now = Date.now()
                 if (dataArray.length > 2 && +dataArray[2] < now) {
                     // 缓存过期
                     localStorage.removeItem(key)
                     return null
                 } else {
                     const value = decodeURIComponent(dataArray[1])
                     return getProcess(dataArray[0]).parse(value)
                 }
             }
         } catch (e) {
             console.log(e)
         }
         return null
     },
     put(key: string, value: any, expired?: number) {
         // expired 过期时间 单位天 默认是100 上线测试没问题替换旧的设值
         const type = typeof value
         const process: any = getProcess(type)
         value = type + SPLIT_STR + encodeURIComponent(process.save(value))
         if (expired) {
             // 默认不传 不过期
             const time = expired * 24 * 60 * 60 * 1000 + new Date().getTime()
             value += SPLIT_STR + time
         }
         localStorage.setItem(key, value)
     },
     clear() {
         localStorage.clear()
     },
     remove(key: string) {
         localStorage.removeItem(key)
     }
 }
 