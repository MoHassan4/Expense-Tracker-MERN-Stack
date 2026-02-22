import React, { useState } from 'react'
import EmojiPickerPopup from '../EmojiPickerPopup';
import Input from '../Inputs/Input';

const AddExpenseForm = ({onAddExpense}) => {
    const[expense , setExpense] = useState({
        category : "",
        amount : "",
        date : "",
        icon : "",
    });

    const handleChange = (key,value)=>setExpense({...expense , [key] : value});


  return (
    <div>
      <EmojiPickerPopup
      icon={expense.icon}
      onSelect={(selectedIcon)=>handleChange("icon",selectedIcon)}
      />

      <Input
      type = "text"
      value={expense.category}
      label = "Expense Category"
      placeholder="Rent, Groceries, etc"
      onChange={({target})=>handleChange("category",target.value)}
      />

      <Input
      type = "number"
      value={expense.amount}
      label = "Expense Amount"
      placeholder=""
      onChange={({target})=>handleChange("amount",target.value)}
      />

      <Input
      type = "date"
      value={expense.date}
      label = "Expense Date"
      placeholder=""
      onChange={({target})=>handleChange("date",target.value)}
      />

      <div className='flex justify-end mt-6'>
        <button type='button' className='add-btn add-btn-fill' onClick={()=>onAddExpense(expense)}>
            Add Expense
        </button>
      </div>
    </div>
  )
}

export default AddExpenseForm
