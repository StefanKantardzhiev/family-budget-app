import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import ExpenseModal from '../Home/Modals/ExpenseModal';
import IncomeModal from '../Home/Modals/IncomeModal';
import { useTranslation } from 'react-i18next';
import './Home.css'; // Make sure to import your CSS file
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {api} from "../../services/rest-api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
   faCartShopping,
 faMoneyBillTransfer
} from '@fortawesome/free-solid-svg-icons';


const Home: React.FC =  () => {
   const [isExpenseModalOpen, setExpenseModalOpen] = useState<boolean>(false);
   const [isIncomeModalOpen, setIncomeModalOpen] = useState<boolean>(false);
   const navigate = useNavigate();
   const { t, i18n } = useTranslation();
   ChartJS.register(ArcElement, Tooltip, Legend);
   const [expensesData, setExpensesData] = useState([]);
   const [incomesData, setIncomesData] = useState([]);
   let [totalBudget, setTotalBudget] = useState(0);
   let [totalProcents, setTotalProcents] = useState(0);
   let allTransactions:any[] = [...expensesData, ...incomesData];
   let total = 0
   let procents:any=0;
   useEffect( () => {
      const fetchData = async () => {
         // Your async operation here, for example:
         const income = await api.get('/income');
         const expense = await api.get('/expense');
         let totalIncome = 0;
         let totalExpense = 0;

         income.forEach((item: any) => {
            totalIncome += item.amount;
         });

         expense.forEach((item: any) => {
            totalExpense += item.amount;
         });

         total = totalIncome
         setTotalBudget(total);
         procents = (totalExpense / totalIncome) * 100;
         setTotalProcents(procents.toFixed(2));
         setExpensesData(expense);
         setIncomesData(income);
      };
      fetchData().then(r => console.log('Data fetched'));
   }, []);

   const prepareChartData = (data:any, label:string) => {
      return {
         labels: data.map((item:any)=> item.description),
         datasets: [
            {
               label: data.map((item:any) => item.description),
               data: data.map((item:any) => item.amount),
               backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
               ],
               borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
               ],
               borderWidth: 1,
            },
         ],
      };
   };
			const expensesChartData = prepareChartData(expensesData, 'Expenses');
			const incomesChartData = prepareChartData(incomesData, 'Incomes');
   const changeLanguage = async (language: string) => {
      await i18n.changeLanguage(language);
      console.log('Language changed to:', language);
   };
   const openExpenseModal = () => setExpenseModalOpen(true);
   const closeExpenseModal = () => setExpenseModalOpen(false);

   const openIncomeModal = () => setIncomeModalOpen(true);
   const closeIncomeModal = () => setIncomeModalOpen(false);

   const handleExpenseSubmit = (expenseData: any) => {
      closeExpenseModal();
   };

   const handleIncomeSubmit = (incomeData: any) => {
      closeIncomeModal();
   };

   return (
     <div className="home">
        <header>
           <div className="logo">FamilyBudget</div>
           <div className="user-profile">
              <i className="fas fa-user-circle"></i>
           </div>
           <div>
              <button onClick={() => changeLanguage('en')}>English</button>
              <button onClick={() => changeLanguage('de')}>Deutsch</button>
              <button onClick={() => changeLanguage('bg')}>Български</button>
           </div>
        </header>
        <div className="container">
           <nav className="sidebar">
              <ul>
                 <li className="active"><i className="fas fa-home"></i> {t('dashboard')}</li>
                 <li><i className="fas fa-wallet"></i>{t(
                   'budgets')}</li>
                 <li><i className="fas fa-receipt"></i> {t('expenses')}</li>
                 <li><i className="fas fa-coins"></i> {t('income')}</li>
                    <button className="btn btn-primary" onClick={openExpenseModal}>+ {t(
                      'addExpense')}</button>
                    <button className="btn btn-secondary" onClick={openIncomeModal}>+ {t(
                      'addIncome')}</button>
              </ul>
           </nav>

           <main>
              <section className="monthly-overview">
                 <div className="progress-circle">
                    <div className="progress"
                         style={{"--percentage": `${totalProcents + '%'}`} as React.CSSProperties}></div>
                    <div className="progress-content">
                       <h3>{totalBudget} €</h3>
                       <p>{totalProcents} % used</p>
                    </div>
                 </div>
                 <section className="recent-transactions">
                    <h2>{t('recentTransactions')}</h2>
                    <ul>
                       {allTransactions && allTransactions.slice(0,5).map((item: any) => (
                         item.type === 'expense'?
                           <li>
                              <span className="date">{item.createdAt.slice(0,10)}</span>
                              <FontAwesomeIcon icon={faCartShopping} color={'red'}/>
                              <span className="description">{item.description}</span>
                              <span className="amount">{item.amount} €</span>
                           </li>
                       :
                 <li>
                    <span className="date">{item.createdAt.slice(0, 10)}</span>
                    <FontAwesomeIcon icon={faMoneyBillTransfer} color={'green'}/>
                    <span className="description">{item.description}</span>
                    <span className="amount">{item.amount} €</span>
                 </li>
                       ))}
                    </ul>
                 </section>
              </section>
              <section className="expense-breakdown">
                 <h2>{t('expenseBreakdown')}</h2>
                 <div className="chart">
                    <div className="chart-item">
                    <h3>{t('expenses')}</h3>
                       <Pie data={expensesChartData}/>
                       <h3>{t('Incomes')}</h3>
                       <Pie data={incomesChartData}/>
                    </div>
                 </div>
              </section>
              <section className="all-transactions">
                 <h2>{t('alltransactions')}</h2>
                 <br/>
                 <ul>
                    {allTransactions && allTransactions.map((item: any) => (
                      item.type === 'expense'?
                        <li>
                           <span className="date">{item.createdAt.slice(0,10)}</span>
                           <FontAwesomeIcon icon={faMoneyBillTransfer} color={'red'}/>
                           <span className="description">{item.description}</span>
                           <span className="amount">{item.amount} €</span>
                        </li>
                        :
                        <li>
                           <span className="date">{item.createdAt.slice(0, 10)}</span>
                           <FontAwesomeIcon icon={faMoneyBillTransfer} color={'green'} />
                           <span className="description">{item.description}</span>
                           <span className="amount">{item.amount} €</span>
                        </li>
                    ))}
                 </ul>
              </section>
           </main>
        </div>
        {
          isExpenseModalOpen &&
          <ExpenseModal
            onClose={closeExpenseModal}
            onSubmit={handleExpenseSubmit}
          />
        }
        {
          isIncomeModalOpen &&
          <IncomeModal
            onClose={closeIncomeModal}
            onSubmit={handleIncomeSubmit}
          />
        }
     </div>
   )
     ;
};
export default Home;