import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from "../../../services/rest-api";
import './EditModal.css';

interface ModalProps {
			onClose: () => void;
			onSubmit: () => void;
			isOpen: boolean;
			incomeData?: any;
}

export const EditModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, incomeData: IncomeData }) => {
			const [incomeData, setIncomeData] = useState(IncomeData);
			const { t } = useTranslation();

			const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
						const { name, value } = e.target;
						setIncomeData((prevData: any) => ({
									...prevData,
									[name]: value
						}));
			};

			const handleSubmit = async (e: React.FormEvent) => {
						e.preventDefault();
						await api.put(`/transactions/${incomeData._id}`, incomeData);
						onSubmit();
						onClose();
			};

			if (!isOpen) return null;

			return (
					<div className="modal">
								<div className="modal-content">
											<span className="close" onClick={onClose}>&times;</span>
											<h2>{t('Edit Transaction')}</h2>
											<form onSubmit={handleSubmit}>
														<div className="form-group">
																	<label htmlFor="description">{t('description')}:</label>
																	<input
																			type="text"
																			id="description"
																			name="description"
																			value={incomeData.description}
																			onChange={handleChange}
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="amount">{t('amount')} €:</label>
																	<input
																			type="number"
																			id="amount"
																			name="amount"
																			value={incomeData.amount}
																			onChange={handleChange}
																			min="0"
																			step="0.01"
																			placeholder="Euro"
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="date">{t('date')}:</label>
																	<input
																			type="date"
																			id="date"
																			name="date"
																			value={new Date(incomeData.date).toISOString().split('T')[0]}
																			onChange={handleChange}
																			required
																	/>
														</div>
														<div className="form-group">
																	<label htmlFor="category">{t('category')}:</label>
																	<select
																			id="category"
																			name="category"
																			value={incomeData.category}
																			onChange={handleChange}
																			required
																	>
																				<option value="">{t('selectCategory')}</option>
																				<option value="salary">{t('salary')}</option>
																				<option value="gifts">{t('gifts')}</option>
																				<option value="shopping">{t('shopping')}</option>
																				<option value="food">{t('food')}</option>
																				<option value="car">{t('car')}</option>
																				<option value="vape">{t('vape')}</option>
																				<option value="travel">{t('travel')}</option>
																				<option value="utilities">{t('utilities')}</option>
																				<option value="other">{t('other')}</option>
																	</select>
														</div>
														<div className="form-group">
														<label htmlFor="type">{t('Type')}:</label>
																	<select
																			id="type"
																			name="type"
																			value={incomeData.type}
																			onChange={handleChange}
																			required
																	>
																				<option value="">{t('Select Type')}</option>
																				<option value="income">{t('income')}</option>
																				<option value="expense">{t('expense')}</option>
																	</select>
														</div>
														<div className="form-actions">
																	<button type="submit" className="btn btn-primary">{t('Edit Transaction')}</button>
																	<button type="button" className="btn btn-secondary" onClick={onClose}>{t('Cancel')}</button>
														</div>
											</form>
								</div>
					</div>
			);
};

export default EditModal;