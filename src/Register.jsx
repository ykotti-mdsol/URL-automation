import React, { useState } from 'react';
import './RegistrationForm.css';

const RegistrationForm = () => {
    const [optionYes, setOptionYes] = useState(false);
    const [optionNo, setOptionNo] = useState(false);
    const [optionYesRave, setOptionYesRave] = useState(false);
    const [optionNoRave, setOptionNoRave] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [urlSetup, setUrlSetup] = useState('');
  const [Productversion, setProductversion] = useState('');
  const [email, setEmail] = useState('');
  const [DbServer, setDbServer] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // perform validation and submit data
    console.log(`Submitted: ${orderId} ${Productversion} (${email})`);
  };
  const handleOptionYesChange = () => {
    setOptionYes(true);
    setOptionNo(false);
  };

  const handleOptionNoChange = () => {
    setOptionNo(true);
    setOptionYes(false);
  };

  const handleOptionYesChangeRave = () => {
    setOptionYesRave(true);
    setOptionNoRave(false);

  };

  const handleOptionNoChangeRave = () => {
    setOptionNoRave(true);
    setOptionYesRave(false);
  };


  return (
    <form onSubmit={handleSubmit} className="registration-form">
      <h2>URL Setup Automation Tool</h2>
      <div className="form-group">
        <label htmlFor="orderId">Order ID:</label>
        <input
          type="text"
          id="orderId"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="urlSetup">URL Setup Flag:</label>
      </div>
      <div>
      <label style={{ display: "inline-block" }}>Is Rave Legacy:</label>
      <div style={{width:"100%" }}>
      
      <label style={{ display: "inline-block" , width:"20%" , "margin-left": "30%" }}>Classic</label>        
      <input
          type="checkbox"
          checked={optionYes}
          onChange={handleOptionYesChange}
          style={{ display: "inline-block" , width:"10%" }}
        />
      </div>
      <div>
      <label style={{ display: "inline-block" , width:"20%" , "margin-left": "30%"   }}>Remora</label>    
        <input
          type="checkbox"
          checked={optionNo}
          onChange={handleOptionNoChange}
          style={{ display: "inline-block" , width:"10%"  }}
        />
      </div>
      </div>

      <div>
      <label style={{ display: "inline-block" }}>Is Rave:</label>
      <div style={{width:"100%" }}>
      
      <label style={{ display: "inline-block" , width:"20%" , "margin-left": "30%"  }}>Classic</label>        
      <input
          type="checkbox"
          checked={optionYesRave}
          onChange={handleOptionYesChangeRave}
          style={{ display: "inline-block" , width:"10%" }}
        />
      </div>
      <div>
      <label style={{ display: "inline-block" , width:"20%" , "margin-left": "30%"  }}>Remora</label>    
        <input
          type="checkbox"
          checked={optionNoRave}
          onChange={handleOptionNoChangeRave}
          style={{ display: "inline-block" , width:"10%"  }}
        />
      </div>
      </div>

      <div className="form-group">
        <label htmlFor="Productversion">Product version:</label>
        <input
          type="text"
          id="Productversion"
          value={Productversion}
          onChange={(e) => setProductversion(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="DbServer">DbServer:</label>
        <input
          type="DbServer"
          id="DbServer"
          value={DbServer}
          onChange={(e) => setDbServer(e.target.value)}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RegistrationForm;
