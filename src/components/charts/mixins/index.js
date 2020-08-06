import { on, off } from '@/libs/tools'
export default {
    name:'echartsBase',
    props: {
        value: Object,
        otherData:{
          type: Object,
          default: () => {
            return {}
          }
        },
        text: String,
        subtext: String
      },
    data(){
        return {
            dom: null,
            // 当前选择的 '日 月 年',默认月
            currentSelect:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAA51BMVEW/vNr///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8xL6inptr///+dnNX///////////////////////////////////+8u+ICAJQ1M6lFRLETEZvMzOokIqKJiM2amdR4d8ZWVbirqtuG/8Y9AAAAQHRSTlMABTp/utrbv4ZBBzCz/b47avh+RvZZCLjHEvpdjaTD0OTf5uDN1ZqybhbMIV/+dJitBKsO+vRvLHG77e7hwXok0HRongAAAAFiS0dEAf8CLd4AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfkBx0CDDDYuguoAAAA2UlEQVQY02WQ7VaCQBCGRym0D6wkS9M00tTKokzNsnRYQDb0/q/HnUEgDu+fOfOcmWfPDgClUNQODvVS+egYkpycGhilchaz8wt04hjVPVMTIg6iRsy8zEKjBnB1TS7h8rKrINYbYN4w9PgdjyA2ocWd8D2Kz/AW2hFMnYgduMtPWnCPOWcXelTWIpCUgOED9Kk4GecAank4hMcnVaSQqVN/Bhi9ILr/4St93qbtNeKfDGn97Z0vbIciUBMbpQxw/LE/6GiyZbHwp7NCcvrP+Zf1vfj5Xa643QE3jk2nhFaXYAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0yOVQwMjoxMjo0OCswMDowMF1niYsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDctMjlUMDI6MTI6NDgrMDA6MDAsOjE3AAAAAElFTkSuQmCC', 
            // 日 月 年 枚举
            dateType:{
                curType:'month',
                day:'day',
                month:'month',
                year:'year'
              },
            // 日 月 年 选中与否的 对应的 SVG 
             dayButton:{
                yes:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAA4VBMVEW/vNr////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////IyOi5uOH///////////////////////////////////////////9FRLECAJRnZr+JiM0kIqK8u+I1M6kTEZvu7vjMzOoa312OAAAAQHRSTlMABTp/utrbv4ZBBzCz/b47avh+RvZZCLjHEvpdjaTD0OTf5uDN1ZqybhbMIV/+dJitBKsO6/NvHXG77e7hwXokV7gIHwAAAAFiS0dEAf8CLd4AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfkBx4IECurirUhAAAAs0lEQVQY02XQZReCUAwG4GFgYmMXdqDYHcPA+P8/SO6lhPt+23N2trMBkHA+fyDIh8KRKNiJxQU0kkhalkqrNytCxjREBxH9xLI5gvcHyVNHQQTIF5CgRkeqOmKxBNmyF7ECVWSwBnWjeKkkb4oNaBrobEeUoMV2tqHDzuxCj8U+iCwOYDhC90XIjwHkiWf7lByvuHE2px9W/mculuZD5ZX2ofhdbzj79dvdXjocT+fLlZY/DnxNOv24UDsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjAtMDctMzBUMDg6MTY6NDIrMDA6MDCQftUEAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTA3LTMwVDA4OjE2OjQyKzAwOjAw4SNtuAAAAABJRU5ErkJggg==',
                no:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfkBx0CFQP8asOmAAAAbUlEQVQoz2P8z0AcYCJSHQMLEruDwRhD/ixDBaZCYwYX4kyEmPAezhZEseE/Au7+//+/CxLf5f///7thPKI9Q5avIR7CzsZQ2EF1qysYziJZ3YFb4VmGPRRaTbYbO1CiEI9CYxwG0iBRMBKbFQASqD6usM5QLgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0yOVQwMjoyMTowMSswMDowMD5gH6AAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDctMjlUMDI6MjE6MDErMDA6MDBPPaccAAAAAElFTkSuQmCC'
              },
              monthButton:{
                yes:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAA51BMVEW/vNr///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8xL6inptr///+dnNX///////////////////////////////////+8u+ICAJQ1M6lFRLETEZvMzOokIqKJiM2amdR4d8ZWVbirqtuG/8Y9AAAAQHRSTlMABTp/utrbv4ZBBzCz/b47avh+RvZZCLjHEvpdjaTD0OTf5uDN1ZqybhbMIV/+dJitBKsO+vRvLHG77e7hwXok0HRongAAAAFiS0dEAf8CLd4AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfkBx0CDDDYuguoAAAA2UlEQVQY02WQ7VaCQBCGRym0D6wkS9M00tTKokzNsnRYQDb0/q/HnUEgDu+fOfOcmWfPDgClUNQODvVS+egYkpycGhilchaz8wt04hjVPVMTIg6iRsy8zEKjBnB1TS7h8rKrINYbYN4w9PgdjyA2ocWd8D2Kz/AW2hFMnYgduMtPWnCPOWcXelTWIpCUgOED9Kk4GecAank4hMcnVaSQqVN/Bhi9ILr/4St93qbtNeKfDGn97Z0vbIciUBMbpQxw/LE/6GiyZbHwp7NCcvrP+Zf1vfj5Xa643QE3jk2nhFaXYAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0yOVQwMjoxMjo0OCswMDowMF1niYsAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDctMjlUMDI6MTI6NDgrMDA6MDAsOjE3AAAAAElFTkSuQmCC',
                no:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUBAMAAAB/pwA+AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAMFBMVEX////8/P38/P38/P38/P38/P38/P38/P38/P38/P38/P38/P38/P38/P38/P3///+zudPEAAAADnRSTlMAALt3mUTM7maqM4gRItfgviQAAAABYktHRACIBR1IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AceCBElVSmpZwAAAFdJREFUCNdjYMABBN8BwSNMprGxCYwpKCgKY4aGBj/Cqw1JAZI2JSU1DLWiz+GiEo/gaiWfwJnrHgsGm0GY+94Ixr17DWYeMxS8964WzJQ9KCgaepCBAQBYWDjl1yaIQgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0zMFQwODoxNzozNyswMDowMCdBmIQAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDctMzBUMDg6MTc6MzcrMDA6MDBWHCA4AAAAAElFTkSuQmCC'
              },
              yearButton:{
                yes:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAA7VBMVEW/vNr///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+FhMuSkdH////////////d3fH///+rqtsCAJRFRLFnZr+8u+LMzOoTEZuamdTu7vgkIqJ4d8Y1M6lWVbiJiM3NoKsvAAAAP3RSTlMABTp/utrbv4ZBBzCz/b47avh+RvZZCLjHEvpdjaTD0OTf5uDN1ZqybhbMIV/+dJitBKsO7m8dcbvt9u3BeiQolr/GAAAAAWJLR0QB/wIt3gAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+QHHggSE7G+bz0AAADmSURBVBjTZZDpUgIxEISHQxB1OQREBVQuT05vBWWY2XCsmvd/HCchu26V/aMr+SrpTgbAKJFMpXcy2d3cHkTaP/DmaJUvhKxYwgXxlnqHjsnaJ19ZLTFlWLkicEVOjF4V4KgmbE1/EI9PoHyKuAlIIYaxWIeG+Bd9Yww24Uyc6UdrTYGYedo5XIirIMqUGGxB21xYUMBMK2Zeyq4DXQMV6VhmDy7/wyuoimuf2BWZpmu4uZUzMSnM3AH0B8hWtkiahubzIxflMscTO+FRHN4/uIH22yF8fEpEo39+eW29vU9nH592+wsK9U5JsPn4sQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNy0zMFQwODoxODoxOSswMDowMMRQvykAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDctMzBUMDg6MTg6MTkrMDA6MDC1DQeVAAAAAElFTkSuQmCC',
                no:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfkBx0CBzlCkmrHAAAAt0lEQVQoz42SYRWDMAyEP/YwgAUs1AKTgIVZAAlomIQhgVqohUmgEm5/KAUKHZc/TXPvLnlJIe7hsctmpjvElor6UlIxPkrRhWpUrGlzPZbrqwNG3sCAoccB8D1aG0mSEUKTpEbsI1gPgF1UssN0mnWGVTGKt3lioa24oz8MY9OpATwW8ICLlLMVZhCsJ6DB4wBDhcMvjOeeeH1Exb7HflN6UfPe7CQ5ihDZzfzFbWJ58jdikw75AdLMqwz7y09FAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIwLTA3LTI5VDAyOjA3OjU3KzAwOjAwQCLteAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMC0wNy0yOVQwMjowNzo1NyswMDowMDF/VcQAAAAASUVORK5CYII='
              },  
        }
    },
    watch:{
        value(n, o) {
           this.$nextTick(() => {
             try {
                off(window, 'resize', this.resize)
             } catch (error) {
                console.log('err======removeEventListener=resize====')
             }
             this.initEchart()
            })
          }
      },
    methods: {
        // 千分符格式化
        formatNumber(num) { 
          if (isNaN(num)) { 
            throw new TypeError("num is not a number"); 
          } 
          return ("" + num).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");  
        },
       // 获取日期类型描述
        getDateTypeStr(type){
          //debugger
          switch (type) {
            case 'day':
              return '日'
              break;
            case 'month':
              return '月'
                break;
            case 'year':
              return '年'
                  break;    
            default:
              return '月'
              break;
          }
        },
        resize () {
            this.dom.resize()
          },
        // 继承中重写方法
        initEchart(){

        }
    }, 
    mounted () {
        this.$nextTick(() => {
         // console.log('======initEchart=resize====')
          this.initEchart()
        })
      },
      beforeDestroy () {
       // console.log('======beforeDestroy=resize====')
        off(window, 'resize', this.resize)
      } 
}