import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ExpenseModal.css';
import { ExpenseData, ModalProps} from '../Modals/interfaces/modal.interfaces'
import {api} from "../../../services/rest-api";


const ExpenseModal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
			const [expenseData, setExpenseData] = useState<ExpenseData>({
						description: '',
						amount: 0,
						date: new Date().toISOString().split('T')[0],
						category: '',
						type:	'expense',
			});
			const { t } = useTranslation();

			const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
						const { name, value } = e.target;
						setExpenseData(prevData => ({
									...prevData,
									[name]: value,
						}));
			};

			const handleSubmit =async (e: React.FormEvent) => {
						e.preventDefault();
						await api.post('/expense', expenseData).then((response:any) => {
									console.log(response.body)
									return response.body
						})
						onSubmit(expenseData);
						onClose();
			};

			return (
					<div className="modal">
								<div className="modal-content">
											<span className="close" onClick={onClose}>&times;</span>
											<h2>{t('addExpense')}</h2>
											<form onSubmit={handleSubmit}>
														<div className="form-group">
																	<label htmlFor="description">{t('description')}:</label>
																	<input
																			type="text"
																			id="description"
																			name="description"
																			value={expenseData.description}
																			onChange={handleChange}
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="amount">{t('amount')}:</label>
																	<input
																			type="number"
																			id="amount"
																			name="amount"
																			value={expenseData.amount}
																			onChange={handleChange}
																			min="0"
																			step="0.01"
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="date">{t('date')}:</label>
																	<input
																			type="date"
																			id="date"
																			name="date"
																			value={expenseData.date}
																			onChange={handleChange}
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="category">{t('category')}:</label>
																	<select
																			id="category"
																			name="category"
																			value={expenseData.category}
																			onChange={handleChange}
																			required
																	>
																				<option value="">{t('selectCategory')}</option>
																				<option value="food">{t('food')}</option>
																				<option value="transportation">{t('transportation')}</option>
																				<option value="utilities">{t('utilities')}</option>
																				<option value="entertainment">{t('entertainment')}</option>
																				<option value="other">{t('other')}</option>
																	</select>
														</div>
														<div className="form-actions">
																	<button type="submit" className="btn btn-primary">{t('addExpense')}</button>
																	<button type="button" className="btn btn-secondary" onClick={onClose}>{t('cancel')}</button>
														</div>
											</form>
								</div>
					</div>
			);
};

export default ExpenseModal;