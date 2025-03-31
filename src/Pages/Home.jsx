import React from 'react'
import { Col, Container, Nav, Navbar, NavDropdown, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../Styles/Home.css'
import Footer from '../Components/Footer'

import { motion } from 'framer-motion';
import { Dumbbell, Users, Clock, CreditCard, BarChart2, Clipboard, Bell, Smartphone } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, text, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="w-72 p-6 m-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
  >
    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-orange-100">
      <Icon className="w-6 h-6 text-orange-500" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </motion.div>
);


const features = [
  { icon: Users, title: 'Member Management', text: 'Add, edit, or remove member details with ease.' },
  { icon: Dumbbell, title: 'Trainer Management', text: 'Assign trainers to members or groups and manage their schedules.' },
  { icon: Clock, title: 'Membership Plans', text: 'Create and customize membership plans to suit your gym\'s needs.' },
  { icon: CreditCard, title: 'Payment Management', text: 'Record payments, generate invoices, and track overdue payments.' },
  { icon: BarChart2, title: 'Reports and Analytics', text: 'View detailed reports on attendance and member growth.' },
  { icon: Clipboard, title: 'Workout Plan Management', text: 'Design personalized workout plans for members and track their progress.' },
  { icon: Bell, title: 'Notifications and Alerts', text: 'Notify members of expiring memberships and upcoming sessions.' },
  { icon: Smartphone, title: 'Responsive Design', text: 'Access the system on both desktop and mobile devices.' }
];



function Home() {
  return (
    <>


      <Navbar expand="lg" className="bg-body-secondary">
        <Container>
          <Navbar.Brand href="">FitNavigator</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#one" className='fw-bold'>Features</Nav.Link>
              <NavDropdown title="Logins" className='fw-bold' id="basic-nav-dropdown">
                <NavDropdown.Item href="/userauth?login=true">User Login</NavDropdown.Item>
                <NavDropdown.Item href="/trainer/login">Trainer Login</NavDropdown.Item>
                <NavDropdown.Item href="/userauth">User Register</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/adminauth?login=true">Admin Login</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


      <div className="container-fluid rounded bg-secondary" style={{height:"90vh",width:"100%",paddingLeft:"90px"}}>
        <Row className='align-items-center p-4'>
            <Col sm={12} md={6}>
                <h1 style={{fontSize:"80px"}} className='fw-bolder text-dark mt-2 pt-0 pb-4'>Fit-Navigator</h1>
                <p>"Transform Your Fitness Journey with Ease!"</p>

                    <p className='text-dark 4'>
                    Welcome to FitNavigator, your ultimate gym management solution! Our platform is designed to streamline and enhance your gym's operations, providing you with powerful tools to manage memberships, track workouts, schedule classes, and monitor progress. With an intuitive interface and robust features, FitFlow ensures that both gym owners and members have a seamless and rewarding experience. Join us in revolutionizing the way you manage your fitness facility and help your members achieve their goals with ease and efficiency.
                    </p>

                    <Link to={'/userauth'} className='btn btn-warning fw-bold text-light lh-lg'>Start to Explore</Link>

            </Col>
            <Col sm={12} md={6} style={{paddingLeft:"40px"}}>
                {/* <img src="https://gymgear.com/wp-content/uploads/2023/01/AdobeStock_317724775-scaled-1.jpeg" style={{marginTop:"80px",borderRadius:"50px"}} width={"600px"} alt="" /> */}
                <img 
                        src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg" 
                        style={{
                          marginTop: "50px",
                          borderRadius: "16px",
                          width: "100%",
                          maxWidth: "800px",
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                          transform: "perspective(1000px)",
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                          border: "4px solid #f59e0b",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                          overflow: "hidden",
                          objectFit: "cover",
                          height: "500px",
                          filter: "brightness(0.95) contrast(1.1)",
                          hover: {
                            transform: "scale(1.02) perspective(1000px)",
                            boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.3), 0 8px 12px -4px rgba(0, 0, 0, 0.65)",
                            filter: "brightness(1) contrast(1.15)"
                          }
                        }}
                        alt="Athlete lifting weights in modern gym facility"
                    />
            
            </Col>
        </Row>
      </div>

      <div className="col-md-6 features-list w-100 my-5" id="one" >
      <div className="py-16 bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container mx-auto px-4"
      >
        <h1 className="text-4xl font-bold text-center mb-12 text-orange-500">
          Our Features
        </h1>
        <div className="flex flex-wrap justify-center gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} index={index} {...feature} />
          ))}
        </div>
      </motion.div>
    </div>
          </div>




          
            <Footer/>
            
    </>
  )
  
}

export default Home
