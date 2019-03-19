<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="5">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234元</div>
                                    <div>资金池</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="5">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321元</div>
                                    <div>放款金额</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="5">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000元</div>
                                    <div>首贷金额</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="4">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000元</div>
                                    <div>展期金额</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="5">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000元</div>
                                    <div>回款金额</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="24">
                <el-col class="title-chats" :span="24">
                    <el-col :span="6" class="title-chats-tlie">放款金额统计表</el-col>
                    <el-col :span="6" class="date-chats-dat">
                        <el-date-picker v-model="dateval" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="5" class="el-title-mg-right">
                        <el-col :span="8" v-for="(item,index) in wpList" :key="index" :class="{active : active == index || index == pid}"  @click.native="selected(index)">{{item.name}}</el-col>
                    </el-col>
                </el-col>
                <el-card shadow="hover">
                    <div class="chart_left">
                        <div class="box-top">
                            <el-col>本月放款总数</el-col>
                            <el-col class="text_color">420</el-col>
                            <el-col  class="text_linet"><img class="img" src="../../../assets/img/icon-top.png" ><i class="text_color_red">10%</i>同比上周</el-col>
                        </div>
                        <div class="box-bottom">
                            <el-col>本月放款总数</el-col>
                            <el-col  class="text_color">420</el-col>
                            <el-col class="text_linet"><img class="img" src="../../../assets/img/icon-bottom.png" ><i class="text_color_blud">10%</i>同比上周</el-col>
                        </div>
                    </div>
                    <div id="chart_example"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import bus from '../../common/bus';
    export default {
        name: 'dashboard',
        data() {
            return {
                wpList: [
                    {
                        name: '本周'
                    },
                    {
                        name: '本月'
                    },
                    {
                        name: '本年'
                    }
                ],
                active: '',
                pid: 0,
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                dateval: '',
                name: localStorage.getItem('ms_username')
            }
        },
        components: {
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created(){
            this.handleListener();
            this.changeDate();
        },
        activated(){
            this.handleListener();
        },
        deactivated(){
            window.removeEventListener('resize', this.renderChart);
            bus.$off('collapse', this.handleBus);
        },
        mounted() {
            let this_ = this;
            let myChart = echarts.init(document.getElementById('chart_example'));
            let option = {
                color: ['#DDE3EB'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {
                        type : 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    areaStyle: {}
                }]
            };
            myChart.setOption(option);
            //建议加上以下这一行代码，不加的效果图如下（当浏览器窗口缩小的时候）。超过了div的界限（红色边框）
            window.addEventListener('resize',function() {myChart.resize()});
        },
        methods: {
            //点击高亮
            selected(item){
                this.active = item;
                this.pid = item
            },
            changeDate(){
                const now = new Date().getTime();
                this.data.forEach((item, index) => {
                    const date = new Date(now - (6 - index) * 86400000);
                    item.name = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`
                })
            },
            handleListener(){
                bus.$on('collapse', this.handleBus);
                // 调用renderChart方法对图表进行重新渲染
                window.addEventListener('resize', this.renderChart)
            },
            handleBus(msg){
                setTimeout(() => {
                    this.renderChart()
                }, 300);
            },
            renderChart(){
                this.$refs.bar.renderChart();
                this.$refs.line.renderChart();
            }
        }
    }

</script>


<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }
    .title-chats{
        text-align: center;
        height: 50px;
        padding: 0 30px;
        line-height: 50px;
        background: #DDE3EB;
    }
    .active {
        background: #fd7522;
        border: 1px solid #fd7522;
        color: #fff;
    }
    .title-chats-tlie{
        font-weight: bold;
        text-align: left;
    }
    .title-chats-right{
        float: right;
    }
    .date-chats-dat{
        float: right;
    }
    .el-title-mg-right{
        cursor: pointer;
        float: right;
    }
    .chart_left{
        width: 14%;
        height: 300px;
        float: left;
        padding: 50px 2%;
        border: 1px solid #AAAAAA;
        border-right: 0px;
    }
    .box-top{
        height: 90px;
        text-align: center;
        padding: 30px 0;
    }
    .box-bottom{
        height: 90px;
        padding: 30px 0;
        text-align: center;
    }
    .text_color{
        font-weight: bold;
        color: #000000;
        font-size: 32px;
        padding: 10px 0;
    }
    .text_color_red{
        color: #F00;
        font-style: normal;
    }
    .text_color_blud{
        color: #409EFF;
        font-style: normal;
    }
    .img{
        width: 16px;
        height: 16px;
    }
    #chart_example {
        width: 80%;
        height: 400px;
        border: 1px solid #AAAAAA;
        float: left;
    }
</style>
