import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './LinhaHorarioEdicao.module.css'; // Use the same CSS as cadastro
import api from '../../services/api';
import Modal from '../../components/Modal/Modal';
import { FaInfoCircle } from 'react-icons/fa';

// Reusable indicators (assuming they are defined in CSS)
const RequiredIndicator = () => (
  <span className={styles.requiredTooltip} data-tooltip="Campo obrigatório">
    *
  </span>
);

function LinhaHorarioEdicao() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the schedule ID from the URL

  const [formData, setFormData] = useState({}); // Holds the schedule data for display and editing
  const [originalFormData, setOriginalFormData] = useState({}); // Holds the initial data
  
  // States for dropdown options (needed for display, even if disabled)
  const [lineOptions, setLineOptions] = useState([]);
  const [directionTypeOptions, setDirectionTypeOptions] = useState([]);
  const [dayTypeOptions, setDayTypeOptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ isOpen: false, message: '', isError: false });
  const [isFormValid, setIsFormValid] = useState(false); // Button state

  // Fetch schedule details and dropdown options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, linesRes, directionsRes, dayTypesRes] = await Promise.all([
          api.get(`/linesTimes/${id}`), // Fetch specific schedule
          api.get('/lines', { params: { PageSize: 1000 } }),
          api.get('/lines/directionTypes'),
          api.get('/employeesWorkdays/daysTypes'), // Assuming same endpoint for day types
        ]);

        setLineOptions(linesRes.data.value.items || []);
        setDirectionTypeOptions(directionsRes.data.value || []);
        setDayTypeOptions(dayTypesRes.data.value || []);

        const scheduleData = scheduleRes.data.value;
        // Convert IDs to strings for select compatibility
        const formattedData = {
          ...scheduleData,
          lineId: scheduleData.lineId.toString(),
          directionType: scheduleData.directionType.toString(),
          dayType: scheduleData.dayType.toString(),
        };
        setFormData(formattedData);
        setOriginalFormData(formattedData); // Store original data

      } catch (err) {
        console.error("Error loading data:", err);
        setFeedback({ isOpen: true, message: "Could not load data for editing.", isError: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Validate form for enabling the save button
  useEffect(() => {
    const requiredFields = ['lineId', 'directionType', 'time', 'dayType'];
    const allRequiredFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalFormData);
    
    setIsFormValid(allRequiredFilled && hasChanges);
  }, [formData, originalFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setFeedback({ isOpen: true, message: 'No changes made or required field is empty.', isError: true });
      return;
    }
    setLoading(true);

    // Payload EXACTLY as required by the PUT endpoint
    const updatePayload = {
      id: parseInt(id, 10),
      time: formData.time,
    };
    
    try {
      await api.put(`/linesTimes/${id}`, updatePayload);
      setFeedback({ isOpen: true, message: 'Line schedule updated successfully!', isError: false });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error updating line schedule.';
      setFeedback({ isOpen: true, message: errorMessage, isError: true });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseModal = () => {
    setFeedback({ isOpen: false, message: '', isError: false });
    if (!feedback.isError) navigate('/linha-horario');
  };

  if (loading) return <p className={styles.container}>Loading schedule data...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Edit Line Schedule: {formData.lineName || '...'}</h1>
        <button onClick={() => navigate('/linha-horario')} className={styles.backButton}>
          Back to List
        </button>
      </div>
      
      <form className={styles.form} onSubmit={handleUpdate} noValidate>
        <div className={styles.formGrid}>
          {/* Line (Read Only) */}
          <div className={styles.inputGroup}>
            <label htmlFor="lineId">Line</label>
            <select name="lineId" id="lineId" value={formData.lineId ?? ''} disabled>
              <option value="">Loading...</option>
              {lineOptions.map(line => (
                <option key={line.id} value={line.id}>{line.number} - {line.name}</option> 
              ))}
            </select>
          </div>

          {/* Direction (Read Only) */}
          <div className={styles.inputGroup}>
            <label htmlFor="directionType">Direction</label>
            <select name="directionType" id="directionType" value={formData.directionType ?? ''} disabled>
              <option value="">Loading...</option>
              {directionTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>

          {/* Time (Editable) */}
          <div className={styles.inputGroup}>
            <label htmlFor="time">Time <RequiredIndicator /></label>
            <input name="time" id="time" type="time" value={formData.time || ''} onChange={handleChange} required />
          </div>

          {/* Day Type (Read Only) */}
          <div className={styles.inputGroup}>
            <label htmlFor="dayType">Day Type</label>
            <select name="dayType" id="dayType" value={formData.dayType ?? ''} disabled>
              <option value="">Loading...</option>
              {dayTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.name}</option>)}
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.saveButton} disabled={!isFormValid || loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
      <Modal isOpen={feedback.isOpen} onClose={handleCloseModal}>
        <div className="feedback-modal-content">
          <h3>{feedback.isError ? 'An Error Occurred' : 'Success!'}</h3>
          <p>{feedback.message}</p>
          <button onClick={handleCloseModal} className="feedback-modal-button">Close</button>
        </div>
      </Modal>
    </div>
  );
}

export default LinhaHorarioEdicao;