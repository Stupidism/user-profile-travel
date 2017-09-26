# 环境
- 前端: node6
- 后端: java8
- 数据库: mongodb
- 爬虫: python3, chrome web driver

# 安装
- `npm install`
  如果太慢,可以尝试`npm install -g cnpm && cnpm install`

# 运行
- npm start 将自动开启三个服务器,并打开浏览器

其中分为三个指令,均可分别运行:
1. `npm run start:front` - 前端文件以及API转发server
2. `npm run start:back` - 后端RESTful API以及调用爬虫server
3. `npm run start:crawler` - 爬虫server