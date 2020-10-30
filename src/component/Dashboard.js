import React, { Component } from 'react' ;
import {Container,Row,Col} from 'react-bootstrap';
import './Dashboard.css';
import WidgetText from './WidgetText';
import Blockwidget from './Blockwidget';
import Doughnutwidget from './Doughnutwidget';
import Scrolllinewidget from './Scrolllinewidget';
import Barwidget from './Barwidget';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

//excel import
const config = {
    apiKey: 'AIzaSyDMu-Vw30ykPPmFT3cXeunzKEi4EahzglI',
    spreadsheetId: '1vcDPrMexD8bxNwwzK9IxF8wch6Hfezq2eooJACDiqgg'
}
const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId
    }/values:batchGet?ranges=Sheet1&majorDimension=ROWS&key=${config.apiKey}`;




class Dashboard extends Component {

    constructor(){
        super();
        this.state ={
            items: [],
         dropdownOptions: [],
         dropdownchart:[],   
         selectedValue: null,
         defaultvalue:null,
         organicSource: null,
         directSource:null,
         referralSource: null,
         socialSource:null,
         emailSource:null,
         pageViews:null,
         users:null,
         newUsers: null,
         session:null,
         numberOfSessionPerUser:null,
         pagePerSession:null,
         avgSessionTime:null,
         bounceRate:null,
         sourceArr: [],
         userArr:[],
         chartarr:[],
         sessions:[],
        }
    }

    getData = arg => {

        const arr = this.state.items;
        const arrLen = arr.length;
        let organicSource = 0;
        let directSource = 0;
        let selectedValue = null;
        let referralSource = 0;
        let socialSource=0;
        let emailSource=0;
        let pageViews=0;
        let users=0;
        let newUsers=0;
        let session=0;
        let numberOfSessionPerUser=0;
        let pagePerSession=0;
        let avgSessionTime=0;
        let bounceRate=0;

        let sourceArr= [];
        let userArr = [];
        let sessions =[]; 


        for (let i = 0; i < arrLen; i++) {
            if (arg === arr[i]["month"]) {
                organicSource = arr[i].organic_source;
                directSource = arr[i].direct_source;
                referralSource = arr[i].referral_source;
                socialSource=arr[i].social_source;
                emailSource=arr[i].email_source;
                pageViews = arr[i].page_views;
                users = arr[i].users;
                newUsers = arr[i].new_users;
                session=arr[i].sessions;
                numberOfSessionPerUser=arr[i].number_of_sessions_per_users;
                pagePerSession=arr[i].page_per_session;
                avgSessionTime=arr[i].avg_session_time;
                bounceRate=arr[i].bounce_rate;

                sourceArr.push({
                    label: "Oraganic",
                    value: arr[i].organic_source,
                }, {
                    label: "Referral",
                    value: arr[i].referral_source,
                },
                {
                    label: "Direct",
                    value: arr[i].direct_source,
                },
                {
                    label: "Social",
                    value: arr[i].social_source,
                },
                {
                    label: "Email",
                    value: arr[i].email_source,
                }
                );

               userArr.push(
                {
                    label: "Users",
                    value: arr[i].users,
                },{
                    label: "New Users",
                    value: arr[i].new_users,
                } 
               ); 

               sessions.push(
                   
                   {
                    label: "Number of Session Per Users",
                    value: arr[i].number_of_sessions_per_users ,
                },
                {
                    label: "Page per Session",
                    value: arr[i].page_per_session ,
                },
                {
                    label: "Avg Session Time",
                    value: arr[i].avg_session_time ,
                },
                {
                    label: "Bouce Rate",
                    value: arr[i].bounce_rate ,
                }
               );

            }
        }
        selectedValue = arg;

        this.setState({
            organicSource: organicSource,
            directSource: directSource,
            referralSource : referralSource,
            socialSource:socialSource,
            emailSource:emailSource,
            pageViews : pageViews,
            users : users,
            newUsers : newUsers,
            session: session,
            numberOfSessionPerUser: numberOfSessionPerUser,
            pagePerSession: pagePerSession,
            avgSessionTime: avgSessionTime,
            bounceRate: bounceRate,

            sourceArr: sourceArr,
            userArr: userArr,
            sessions:sessions,
        });

    }

    updateDashBoard = event => {
        this.getData(event.value);
        this.setState({ selectedValue: event.value });
    };
    getDataSet = arg => {
        let chartarr=[];
        for (let i = 0; i < this.state.items.length; i++) {
                  
                  chartarr.push(
                    {
                        label: this.state.items[i]["month"],
                        value: this.state.items[i][arg],
                    },);
            }
       
        this.setState({
            chartarr:chartarr,
        });



    };
    updatechart = event => {
        this.getDataSet(event.value);
        this.setState({ defaultvalue: event.value });
        
    };

   
    componentDidMount() {
        fetch(url)
            .then(response => response.json())
            .then(data => {

                let batchRowValues = data.valueRanges[0].values;

                const rows = [];

                for (let i = 1; i < batchRowValues.length; i++) {
                    
                    let rowObject = {};
                    for (let j = 0; j < batchRowValues[i].length; j++) {
                       
                        
                        rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
                    }
                    rows.push(rowObject);
                }
            

                //dropdown for line chart of complete data
                let dropdownchart = [];
                for(let i = 1; i<= batchRowValues.length; i++){
                    dropdownchart.push(batchRowValues[0][i]);

                }

                 // dropdown options
                 let dropdownOptions = [];

                 for (let i = 0; i < rows.length; i++) {
                     dropdownOptions.push(rows[i].month);
                 }
 
                 dropdownOptions = Array.from(new Set(dropdownOptions)).reverse();
                 this.setState(
                     {
                         items: rows,
                         dropdownOptions: dropdownOptions,
                         selectedValue: "Jan 2018"
                     },
                     () => this.getData("Jan 2018")
                                        );

                 this.setState(
                     {
                        dropdownchart:dropdownchart,
                        defaultvalue: "bounce_rate",
                     },
                     () => this.getDataSet("bounce_rate")

                 );
            });

    }
    render() {

       

  
        return (
           <>
          
           <Container fluid className="header">
               <Row>
                   <Col md={{span:9}} className="heading">DashBoard</Col>
                   <Col><Dropdown className="drop" options={this.state.dropdownOptions} onChange={this.updateDashBoard} value={this.state.selectedValue} placeholder="Select an option" /></Col>
               </Row>
           </Container>
           <Container className="fyc">
               <Row className="dataset">
                   <Col  md={{span:7}} className="heading">Data set</Col>
                   <Col><Dropdown className="drop" options={this.state.dropdownchart} onChange={this.updatechart} value={this.state.defaultvalue} placeholder="Select an option" /></Col>
               </Row>
               <Row className="chart">
                   <Col><Scrolllinewidget  data={this.state.chartarr } /></Col>
            </Row>

           </Container>
                      <h3 className="title">Soruce Stats</h3>
           <div className="source">

            
                    <Container>
                        <Row>
                                <Col> <WidgetText title={'Organic'} value={this.state.organicSource} description={''}/>  </Col>   
                                <Col><WidgetText title={'Direct'} value={this.state.users} description={''}/></Col>  
                        </Row>
                        <br />
                        <Row> 
                                <Col><WidgetText title={'Referral'} value={this.state.referralSource} description={''}/></Col>
                                <Col><WidgetText title={'Social'} value={this.state.socialSource} description={''}/></Col>          
                        </Row>
                        <br />       
                        <Row> 
                                <Col md={{span:6}}><WidgetText title={'Email'} value={this.state.emailSource} description={''}/></Col>     
                        </Row>
                        
                    </Container>
                    <Container>
                        <Row>
                           <Col ><Blockwidget title='Source Block Chart' data={this.state.sourceArr } /> </Col>
                        </Row>
                    </Container>
            
            </div>

            <h3 className="title">Page Stats</h3>
           <div className="source">

            
                    <Container>
                        <Row> 
                            <Col><WidgetText title={'Pages'} value={this.state.pageViews} description={''}/></Col>
                        </Row>
                        <br /> 
                        <Row> 
                            <Col><WidgetText title={'Users'} value={this.state.users} description={''}/></Col>
                            <Col><WidgetText title={'New Users'} value={this.state.newUsers} description={''}/></Col>
                        </Row>      
                    </Container>
                    <Container>
                        <Row>
                        <Col><Doughnutwidget title='User Doughnut chart' data={this.state.userArr } /> </Col>
                        </Row>
                    </Container>
            
            </div>

            <h3 className="title">Session Stats</h3>
          
           <div className="source">
                <Container>
                        <Row> 
                            <Col md={{span:9}}><WidgetText title={'Session'} value={this.state.session} description={''}/></Col></Row>
                        <br />
                        <Row>
                         <Col md={{span:9}}><WidgetText title={'Average Session Time'} value={this.state.avgSessionTime} description={''}/></Col>
                         </Row>
                         <br />
                         <Row>   
                            <Col md={{span:9}}><WidgetText title={'Bounce Rate'} value={this.state.bounceRate} description={''}/></Col>
                        </Row>   
                </Container>
                        <Container className="setting"> 
                        <Row > 
                           
                            <Col md={{span:7}}><WidgetText title={'No of sessions per User'} value={this.state.numberOfSessionPerUser} description={''}/></Col>
                            <Col md={{span:5}}><WidgetText title={'Page per session'} value={this.state.pagePerSession} description={''}/></Col>
                     
                        </Row>
                        <br />
                        <Row>
                        <Col  md={{span:12}}> <Barwidget title="Session Bar Chart" data={this.state.sessions}/> </Col>
                        </Row>
                    </Container>
            
            </div>

           
        <br />
            <hr/>
            <h5 className="footer">Created by M Furqan Asif  </h5>
            <hr/>
           </>          
        );
    }
}

export default Dashboard;
