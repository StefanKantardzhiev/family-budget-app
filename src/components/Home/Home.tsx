import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Home.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { api } from "../../services/rest-api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEdit, faTrash, faUpDown} from "@fortawesome/free-solid-svg-icons";
import EditModal from "../../components/Home/Modals/EditModal";
import CreateModal from "../../components/Home/Modals/CreateModal";

interface Transaction {
   _id?: any;
   id: string;
   amount: number;
   description: string;
   createdAt: string;
   category: string;
   type: 'expense' | 'income';
   date: Date;
}

ChartJS.register(ArcElement, Tooltip, Legend);

const Home: React.FC = () => {
   const { t, i18n } = useTranslation();
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [totalBudget, setTotalBudget] = useState<number>(0);
   const [totalExpenses, setTotalExpenses] = useState<number>(0);
   const [remainingBudget, setRemainingBudget] = useState<number>(0);
   const [totalProcents, setTotalProcents] = useState<string>('0');
   const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
   const [expensesData, setExpensesData] = useState<Transaction[]>([]);
   const [incomesData, setIncomesData] = useState<Transaction[]>([]);
   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
   const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
   const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
   const [isCreateModalOpen, setCreateModalOpen] = useState<boolean>(false);

   const openCreateModal = (): void => {
      setCreateModalOpen(true);
   };

   const closeCreateModal = (): void => {
      setCreateModalOpen(false);
   };
   const fetchData = async (): Promise<void> => {
      const transactionsFromAPI: Transaction[] = await api.get('/transactions');
      const expense = transactionsFromAPI.filter(transaction => transaction.type === 'expense');
      const income = transactionsFromAPI.filter(transaction => transaction.type === 'income');
      transactionsFromAPI.sort((a, b) => {
         const dateA = new Date(a.date);
         const dateB = new Date(b.date);
         return dateB.getTime() - dateA.getTime();
      });
      setTransactions(transactionsFromAPI);
      setIncomesData(income);
      setExpensesData(expense);
      updateTotals(expense, income);
   };

   useEffect(() => {
      fetchData().then((data) => {
         return data
      }).catch((error) => {
         console.log(`Error:${error}`);
      });
   }, [currentMonth]);
   useEffect(() => {
      const filteredTransactions = filterTransactionsByMonth([...expensesData, ...incomesData], currentMonth);
      setTransactions(filteredTransactions);
   }, [currentMonth, expensesData, incomesData]);
   const updateTotals = (expenses: Transaction[], incomes: Transaction[]): void => {
      const filteredExpenses = filterTransactionsByMonth(expenses, currentMonth);
      const filteredIncomes = filterTransactionsByMonth(incomes, currentMonth);

      const totalIncome = filteredIncomes.reduce((sum, item) => sum + item.amount, 0);
      const totalExpense = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);

      setTotalBudget(totalIncome);
      setTotalExpenses(totalExpense);
      setRemainingBudget(totalIncome - totalExpense);
      setTotalProcents(((totalExpense / totalIncome) * 100).toFixed(2));
   };

   const filterTransactionsByMonth = (transactions: Transaction[], date: Date): Transaction[] => {
      return transactions.filter(transaction => {
         const transactionDate = new Date(transaction.date);
         return transactionDate.getMonth() === date.getMonth() &&
           transactionDate.getFullYear() === date.getFullYear();
      });
   };

   const prepareChartData = (data: Transaction[], label: string): ChartData<'pie'> => {
      const filteredData = filterTransactionsByMonth(data, currentMonth).filter((item) => item.type === 'expense');

      const categoryTotals: { [key: string]: number } = {};
      filteredData.forEach((item) => {
         if (categoryTotals[item.category]) {
            categoryTotals[item.category] += item.amount;
         } else {
            categoryTotals[item.category] = item.amount;
         }
      });

      const labels = Object.keys(categoryTotals);
      const amounts = Object.values(categoryTotals);

      return {
         labels: labels,
         datasets: [
            {
               data: amounts,
               backgroundColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(72,235,54,0.8)',
                  'rgba(218,9,83,0.8)',
                  'rgba(16,39,133,0.8)',
                  'rgba(24,169,165,0.8)',
                  'rgba(131,100,23,0.8)',
               ],
               borderColor: [
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(72,235,54,0.8)',
                  'rgba(218,9,83,0.8)',
                  'rgba(16,39,133,0.8)',
                  'rgba(24,169,165,0.8)',
                  'rgba(131,100,23,0.8)',
               ],
               borderWidth: 2,
            },
         ],
      };
   };

   const expensesChartData = prepareChartData(expensesData, 'Expenses');
   const incomesChartData = prepareChartData(incomesData, 'Incomes');

   const changeMonth = (increment: number): void => {
      setCurrentMonth(prevMonth => {
         const newMonth = new Date(prevMonth);
         newMonth.setMonth(newMonth.getMonth() + increment);
         return newMonth;
      });
   };

   const handleSortByAmount = (): void => {
      const sortedExpenses = [...expensesData].sort((a, b) => {
         if (sortOrder === 'asc') {
            return a.amount - b.amount;
         } else {
            return b.amount - a.amount;
         }
      });

      const sortedIncomes = [...incomesData].sort((a, b) => {
         if (sortOrder === 'asc') {
            return a.amount - b.amount;
         } else {
            return b.amount - a.amount;
         }
      });
      setExpensesData(sortedExpenses);
      setIncomesData(sortedIncomes);
      let allTransactions = [...sortedExpenses, ...sortedIncomes];
      setTransactions(allTransactions);
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
   };

   const formatMonth = (date: Date): string => {
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
   };

   const openEditModal = (transaction: Transaction): void => {
      setTransactionToEdit(transaction);
      setEditModalOpen(true);
   };

   const closeEditModal = (): void => {
      setEditModalOpen(false);
   };


   const deleteTransaction = async (id: string): Promise<void> => {
      console.log(`Delete transaction with id: ${id}`);
      await api.delete(`/transactions/${id}`);
      const updatedTransactions = transactions.filter(transaction => transaction._id !== id);
      await fetchData();
      setTransactions(updatedTransactions);
      updateTotals(expensesData, incomesData);
   };

   return (
     <div className="home-container">
        <div className="date-picker">
           <button className="date-button" onClick={() => changeMonth(-1)}>←</button>
           <span id={'monthSpan'}>{formatMonth(currentMonth)}</span>
           <button className="date-button" onClick={() => changeMonth(1)}>→</button>
        </div>
        <main>
           <section className="budget-section">
              <div className="budget-card">
                 <h2>{t('Total Income')}</h2>
                 <p className="budget-value">{totalBudget.toFixed(2)} €</p>
              </div>
              <div className="budget-card">
                 <h2>{t('Total Expenses')}</h2>
                 <p className="budget-value">{totalExpenses.toFixed(2)} €</p>
              </div>
              <div className="budget-card">
                 <h2>{t('Current Budget')}</h2>
                 <p className="budget-value">{remainingBudget.toFixed(2)} €</p>
              </div>
           </section>

           <div className="progress-bar">
              <div className="progress" style={{width: `${totalProcents}%`}}></div>
           </div>

           <div className="dashboard-content">
              <section className="main-chart">
                 <h2>{t('Expenses Chart')}</h2>
                 <Pie data={expensesChartData}/>
              </section>
                 <div className="pie-chart">
                    <h2>{t('Income Chart')}</h2>
                    <Pie data={incomesChartData}/>
                 </div>
           </div>

           <section className="search-section">
              <div className="search-container">
                 <input type="text" placeholder={t('search')} className="search-input"/>
                 <button className="search-button">🔍</button>
              </div>
              <div className="action-buttons">
                 <button className="pdf-button">{t('PDF')}</button>
                 <button className="upload-button">{t('Upload')}</button>
                 <button className="no-fill-button">{t('No fil...')}</button>
              </div>
              <button onClick={openCreateModal}>Create Transaction</button>
              {isCreateModalOpen && (
                <CreateModal
                  isOpen={isCreateModalOpen}
                  onClose={closeCreateModal}
                  onSubmit={fetchData}
                />
              )}
           </section>

           <section className="table-section">
              <table>
                 <thead>
                 <tr>
                    <th>{t('ID')}</th>
                    <th>{t('Description')}</th>
                    <th>{t('Amount')}<FontAwesomeIcon icon={faUpDown} onClick={handleSortByAmount}/></th>
                    <th>{t('Date')} </th>
                    <th>{t('Category')}</th>
                    <th>{t('Type')}</th>
                    <th>{t('Actions')}</th>
                 </tr>
                 </thead>
                 <tbody>
                 {transactions.map((transaction) => (
                   <tr key={transaction.id}>
                      <td>{transaction._id}</td>
                      <td>{transaction.description}</td>
                      <td>{transaction.amount.toFixed(2)} €</td>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction?.category}</td>
                      <td>{transaction.type}</td>
                      <td>
                         <button className={"lang-button"} onClick={() => openEditModal(transaction)}>
                            <FontAwesomeIcon icon={faEdit}/>
                         </button>
                         <button className={"lang-button"} onClick={() => deleteTransaction(transaction._id)}>
                            <FontAwesomeIcon icon={faTrash}/>
                         </button>
                      </td>
                   </tr>
                 ))}
                 </tbody>
              </table>
           </section>
        </main>
        {isEditModalOpen && transactionToEdit && (
          <EditModal
            isOpen={isEditModalOpen}
            incomeData={transactionToEdit}
            onClose={closeEditModal}
            onSubmit={fetchData}
          />
        )}
     </div>
   );
};
export default Home;