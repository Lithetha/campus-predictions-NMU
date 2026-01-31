import { useState, useEffect } from 'react'

function App() {
  // Load from localStorage or use defaults
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem('userPoints');
    return saved ? parseInt(saved) : 1000;
  });
  
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || '';
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [betAmount, setBetAmount] = useState(50);
  const [betChoice, setBetChoice] = useState('');
  const [activeTab, setActiveTab] = useState('predictions');

  const [leaderboard] = useState([
    { name: 'Thabo M.', points: 1450, betsWon: 12, betsLost: 3 },
    { name: 'Lerato K.', points: 1320, betsWon: 10, betsLost: 4 },
    { name: 'Sipho N.', points: 1180, betsWon: 8, betsLost: 5 },
    { name: 'Naledi P.', points: 1050, betsWon: 7, betsLost: 6 },
    { name: 'Themba D.', points: 980, betsWon: 6, betsLost: 7 },
  ]);

  const [predictions, setPredictions] = useState(() => {
    const saved = localStorage.getItem('predictions');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        question: "Will NSFAS pay both food and book allowances in full by end of February 2026?",
        deadline: "2026-02-28",
        totalYesBets: 320,
        totalNoBets: 480,
        status: "active"
      },
      {
        id: 2,
        question: "Will EFFSC win the student elections this year?",
        deadline: "2026-06-30",
        totalYesBets: 450,
        totalNoBets: 350,
        status: "active"
      },
      {
        id: 3,
        question: "Will Madibaz Rugby make it to the Varsity Cup finals in 2026?",
        deadline: "2026-04-30",
        totalYesBets: 520,
        totalNoBets: 280,
        status: "active"
      },
      {
        id: 4,
        question: "Will Madibaz Fitness Center host a fitness competition in 2026?",
        deadline: "2026-12-31",
        totalYesBets: 200,
        totalNoBets: 150,
        status: "active"
      },
      {
        id: 5,
        question: "Will Mechatronics have 15+ students graduate cum laude in 2026?",
        deadline: "2026-12-31",
        totalYesBets: 180,
        totalNoBets: 220,
        status: "active"
      },
      {
        id: 6,
        question: "Will there be load-shedding on campus during exam week?",
        deadline: "2026-06-15",
        totalYesBets: 650,
        totalNoBets: 150,
        status: "active"
      },
      {
        id: 7,
        question: "Will registration for Semester 1 open on time?",
        deadline: "2026-02-15",
        totalYesBets: 250,
        totalNoBets: 550,
        status: "active"
      }
    ];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('userPoints', userPoints.toString());
  }, [userPoints]);

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('predictions', JSON.stringify(predictions));
  }, [predictions]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsLoggedIn(true);
    }
  };

  const calculateOdds = (yesBets, noBets) => {
    const total = yesBets + noBets;
    if (total === 0) return { yes: 50, no: 50 };
    return {
      yes: Math.round((yesBets / total) * 100),
      no: Math.round((noBets / total) * 100)
    };
  };

  const openBetModal = (prediction, choice) => {
    setSelectedPrediction(prediction);
    setBetChoice(choice);
    setBetAmount(50);
  };

  const placeBet = () => {
    if (betAmount > userPoints) {
      alert("Not enough points!");
      return;
    }
    if (betAmount < 10) {
      alert("Minimum bet is 10 points!");
      return;
    }

    setUserPoints(userPoints - betAmount);

    setPredictions(predictions.map(pred => {
      if (pred.id === selectedPrediction.id) {
        return {
          ...pred,
          totalYesBets: betChoice === 'yes' ? pred.totalYesBets + betAmount : pred.totalYesBets,
          totalNoBets: betChoice === 'no' ? pred.totalNoBets + betAmount : pred.totalNoBets
        };
      }
      return pred;
    }));

    setSelectedPrediction(null);
    alert(`✅ Bet placed! You bet ${betAmount} points on ${betChoice.toUpperCase()}`);
  };

  if (!isLoggedIn) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ 
          backgroundColor: 'white',
          padding: '50px 40px',
          borderRadius: '20px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px' }}>Campus Predictions</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            Predict campus events and compete with your friends!
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{ 
                padding: '15px',
                fontSize: '16px',
                width: '100%',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                marginBottom: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button 
              type="submit"
              style={{ 
                width: '100%',
                padding: '15px',
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Start Predicting 🚀
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          backgroundColor: 'white',
          padding: '20px 30px',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ margin: 0, fontSize: '28px' }}>🎯 Campus Predictions</h1>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            fontSize: '16px'
          }}>
            <span><strong>{userName}</strong></span>
            <div style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold'
            }}>
              {userPoints} pts
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <button
            onClick={() => setActiveTab('predictions')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: activeTab === 'predictions' ? 'white' : 'rgba(255,255,255,0.2)',
              color: activeTab === 'predictions' ? '#667eea' : 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              borderRadius: '10px',
              transition: 'all 0.3s',
              boxShadow: activeTab === 'predictions' ? '0 4px 15px rgba(0,0,0,0.1)' : 'none'
            }}>
            📊 Predictions
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            style={{
              padding: '12px 24px',
              border: 'none',
              backgroundColor: activeTab === 'leaderboard' ? 'white' : 'rgba(255,255,255,0.2)',
              color: activeTab === 'leaderboard' ? '#667eea' : 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              borderRadius: '10px',
              transition: 'all 0.3s',
              boxShadow: activeTab === 'leaderboard' ? '0 4px 15px rgba(0,0,0,0.1)' : 'none'
            }}>
            🏆 Leaderboard
          </button>
        </div>

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <div style={{ display: 'grid', gap: '20px' }}>
            {predictions.map(pred => {
              const odds = calculateOdds(pred.totalYesBets, pred.totalNoBets);
              return (
                <div key={pred.id} style={{ 
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <h3 style={{ marginTop: 0, fontSize: '20px', color: '#1a202c' }}>
                    {pred.question}
                  </h3>
                  <p style={{ color: '#718096', fontSize: '14px', marginBottom: '20px' }}>
                    🕐 Closes: {new Date(pred.deadline).toLocaleDateString()}
                  </p>
                  
                  <div style={{ 
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '20px',
                    padding: '20px',
                    backgroundColor: '#f7fafc',
                    borderRadius: '10px'
                  }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#10b981',
                        marginBottom: '5px'
                      }}>
                        {odds.yes}%
                      </div>
                      <div style={{ fontSize: '14px', color: '#718096', fontWeight: '600' }}>
                        YES
                      </div>
                    </div>
                    <div style={{ 
                      width: '2px',
                      backgroundColor: '#e2e8f0'
                    }}></div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ 
                        fontSize: '36px',
                        fontWeight: 'bold',
                        color: '#ef4444',
                        marginBottom: '5px'
                      }}>
                        {odds.no}%
                      </div>
                      <div style={{ fontSize: '14px', color: '#718096', fontWeight: '600' }}>
                        NO
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                      onClick={() => openBetModal(pred, 'yes')}
                      style={{ 
                        flex: 1,
                        padding: '15px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                      }}>
                      👍 Bet YES
                    </button>
                    <button 
                      onClick={() => openBetModal(pred, 'no')}
                      style={{ 
                        flex: 1,
                        padding: '15px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                      }}>
                      👎 Bet NO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0, fontSize: '28px', marginBottom: '25px' }}>
              🏆 Top Predictors
            </h2>
            
            {leaderboard.map((user, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                marginBottom: '15px',
                backgroundColor: index < 3 ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : '#f9fafb',
                border: index < 3 ? '2px solid #fbbf24' : '2px solid #e5e7eb',
                borderRadius: '12px',
                transition: 'transform 0.3s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ 
                  fontSize: '32px',
                  width: '60px',
                  textAlign: 'center'
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {user.betsWon}W - {user.betsLost}L | Win rate: {Math.round((user.betsWon / (user.betsWon + user.betsLost)) * 100)}%
                  </div>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#10b981',
                  backgroundColor: '#d1fae5',
                  padding: '10px 20px',
                  borderRadius: '10px'
                }}>
                  {user.points}
                </div>
              </div>
            ))}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '20px',
              marginTop: '30px',
              background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
              border: '3px solid #667eea',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '32px', width: '60px', textAlign: 'center' }}>
                👤
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' }}>
                  {userName} (You)
                </div>
                <div style={{ fontSize: '14px', color: '#4c51bf' }}>
                  Keep betting to climb the ranks!
                </div>
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#667eea',
                backgroundColor: 'white',
                padding: '10px 20px',
                borderRadius: '10px'
              }}>
                {userPoints}
              </div>
            </div>
          </div>
        )}

        {/* Betting Modal */}
        {selectedPrediction && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '35px',
              borderRadius: '20px',
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }}>
              <h3 style={{ marginTop: 0, fontSize: '24px' }}>Place Your Bet</h3>
              <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '10px' }}>
                {selectedPrediction.question}
              </p>
              <div style={{
                padding: '12px 20px',
                backgroundColor: betChoice === 'yes' ? '#d1fae5' : '#fee2e2',
                color: betChoice === 'yes' ? '#065f46' : '#991b1b',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                Betting on: {betChoice.toUpperCase()} {betChoice === 'yes' ? '👍' : '👎'}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
                  Amount (points):
                </label>
                <input
                  type="number"
                  min="10"
                  max={userPoints}
                  value={betAmount}
                  onChange={(e) => setBetAmount(parseInt(e.target.value) || 10)}
                  style={{ 
                    width: '100%',
                    padding: '15px',
                    fontSize: '18px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
                  Available: {userPoints} points
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '25px' }}>
                <button
                  onClick={() => setSelectedPrediction(null)}
                  style={{
                    flex: 1,
                    padding: '15px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}>
                  Cancel
                </button>
                <button
                  onClick={placeBet}
                  style={{
                    flex: 1,
                    padding: '15px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                  }}>
                  Confirm Bet 🚀
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App