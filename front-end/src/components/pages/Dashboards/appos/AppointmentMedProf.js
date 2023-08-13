import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import NavbarMedProf from '../../../inc/navbar/NavbarMedProf';

const AppointmentDoc = () => {
  const [appointments, setAppointments] = useState([]);

// API call http://localhost:8080/api/v1/appointment/find/patientid/{patientid}
const fetchAppointmentsByMedProfId = async () => {
  try {
    const userJSON = sessionStorage.getItem('user');
    const user = JSON.parse(userJSON);
    const token = user.accessToken;
    const professionalId = sessionStorage.getItem('professionalId');
    const response = await axios.get('http://localhost:8080/api/v1/appointment/find/medprofid/' + professionalId, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Check the status code directly
    if (response.status === 401) {
      console.log('Unauthorized'); // Handle unauthorized case
    } else {
      console.log(response.data); // Handle successful response
    }

    return response.data; // Always return response data
  } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // Rethrow the error to handle it where the function is called
  }
};

const navigate = new useNavigate();

useEffect(() => {
  const fetchData = async () => {
    try {
      const appointmentsData = await fetchAppointmentsByMedProfId();
      setAppointments(appointmentsData);
    } catch (error) {
      // Handle error if needed
    }
  };

  fetchData();
}, []);

console.log(appointments);

if (appointments.length === 0){
  navigate('/medprof/no_appointments');
  return null;
}

const handleAccept = async (appointment) => {
  appointment.accept = true;
  console.log(appointment);
    try {
      const userJSON = sessionStorage.getItem('user');
      const user = JSON.parse(userJSON);
      const token = user.accessToken;
      const response = await axios.put('http://localhost:8080/api/v1/appointment/save/' + appointment.appointmentId,
      appointment,
       {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status===200) {
        alert('Save successfull !');
      } else {
        alert('Save unsuccessfull !');
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
    window.location.reload();
};

const handleDeny = async (appointment) => {
  appointment.accept = false;
  console.log(appointment);
    try {
      const userJSON = sessionStorage.getItem('user');
      const user = JSON.parse(userJSON);
      const token = user.accessToken;
      const response = await axios.put('http://localhost:8080/api/v1/appointment/save/' + appointment.appointmentId,
      appointment,
       {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if(response.status===200) {
        alert('Save successfull !');
      } else {
        alert('Save unsuccessfull !');
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
    window.location.reload();
};
const isCurrentUserPatient = false; // Set this based on your logic

  return (
    <>
    <NavbarMedProf/>
    <div className='body'>
      <Container>
        <h2 className='topic mt-3'>
          Appointments
        </h2>
      </Container>
      <pre></pre>
      <section className='section bg-c-light border-top border-bottom'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <pre></pre>
            </div>

            {appointments.map((appointment) => (
              <div className='col-md-4 my-2' key={appointment.appointmentId}>
                <div className={appointment.accept ?'card bg-success shadow container':'card bg-danger shadow container'}>
                  <div className='card-body bg-light px-3 py-2'>
                    <h6 className='appobold'>
                    {`${appointment.patient.fname} ${appointment.patient.lname}`}
                    </h6>
                    <p>
                      <span className='appoDetail'>Appointment no:</span> {appointment.appointmentId} <br />
                      <span className='appoDetail'>Date:</span> {appointment.date} <br />
                      <span className='appoDetail'>Due Date:</span> {appointment.dueDate} <br />
                      <span className='appoDetail'>Reason:</span> {appointment.reason} <br/ >
                      <span className='appoDetail'>Accepted:</span> {(appointment.accept)? <span>True</span> : <span>False</span>}
                    </p>
                    <div className='d-flex'>
                      <Button variant='primary' disabled={appointment.accept ? true: false} className='ms-2 btn-light btn-outline-success' onClick={() => handleAccept(appointment)}>Accept</Button>
                      <Button variant='primary' disabled={appointment.accept ? false: true} className='ms-2 btn-light btn-outline-danger' onClick={() => handleDeny(appointment)}>Deny</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
    </>
  );
}

export default AppointmentDoc;