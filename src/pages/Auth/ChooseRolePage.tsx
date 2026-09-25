import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AuthPages.css';

export const ChooseRolePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'student' | 'mentor'>('student');

  const handleFinish = () => {
    if (selectedRole === 'mentor') {
      navigate('/mentor');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="nex-auth-wrapper">
      <div className="nex-auth-card">
        
        <div className="nex-auth-steps">
          <div className="nex-auth-step-bar"></div>
          <div className="nex-auth-step-bar active"></div>
          <div className="nex-auth-step-bar active"></div>
        </div>

        <h1 className="nex-auth-title">
          Як ви плануєте використовувати NEXYLVA?
        </h1>
        <p className="nex-auth-subtitle">
          Оберіть роль — її можна буде змінити пізніше в налаштуваннях
        </p>

        <div className="nex-role-grid">
          <button
            type="button"
            className={`nex-role-card ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('student')}
          >
            <div className="nex-role-title">Студент</div>
            <div className="nex-role-desc">
              Навчатися, проходити курси, виконувати завдання та збирати портфоліо.
            </div>
          </button>

          <button
            type="button"
            className={`nex-role-card ${selectedRole === 'mentor' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('mentor')}
          >
            <div className="nex-role-title">Ментор</div>
            <div className="nex-role-desc">
              Перевіряти роботи студентів, залишати feedback та вести навчальні програми.
            </div>
          </button>
        </div>

        <button
          type="button"
          className="nex-auth-submit-btn"
          onClick={handleFinish}
        >
          Завершити реєстрацію
        </button>

        <div className="nex-role-hint">
          Після цього ви перейдете до свого кабінету
        </div>
      </div>
    </div>
  );
};
export default ChooseRolePage;
