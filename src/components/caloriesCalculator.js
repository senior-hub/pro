import { useApp } from "../context/AppContext";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";


const CaloriesCalculator = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [grams, setGrams] = useState("");
  const [calculated, setCalculated] = useState(null);
  const [calculatedItems, setCalculatedItems] = useState([]);
  const [foodItem, setFoodItem] = useState("");
  const [amountGrams, setAmountGrams] = useState("");
  const [ItemCalories, setItemCalories] = useState("");
 
  const { userId } = useApp(); 
  const fetchCaloLog = async () => {
    if (!userId) return;

  
    try {
      console.log("Sending userId:", userId);
      const response = await fetch(`http://localhost/my-app/src/backend/CaloLogFetch.php?user_id=${encodeURIComponent(userId)}`);
      const contentType = response.headers.get("Content-Type");
      console.log("Content-Type:", contentType);

      const text = await response.text();
      console.log("Raw response text:", text);
  
      try {
        if(text) { 
        const data = JSON.parse(text);
        console.log("Parsed JSON data:", data);
        setCalculatedItems(data);}
        else {
          console.error("No data received");
        }

      } catch (jsonErr) {
        console.error("Failed to parse JSON:", jsonErr);
      }
  
    } catch (error) {
      console.error("Error fetching logs via GET:", error);
    }
  };
  
  const logReset = async () => {
    if (!userId) return;
  
    try {
      console.log("Sending userId:", userId);
  
      const response = await fetch(`http://localhost/my-app/src/backend/CaloReset.php?user_id=${encodeURIComponent(userId)}`);
  
      const text = await response.text();
      console.log("Raw response text:", text);
  
    } catch (error) {
      console.error("Error fetching logs via GET:", error);
    }
  };
  
  const logRemove = async (item) => {
    console.log("Logging item:", item.created_at);
    
    try {
      console.log("Sending userId:", userId);
  
      const response = await fetch(
        `http://localhost/my-app/src/backend/CaloRemove.php?user_id=${encodeURIComponent(userId)}&created_at=${encodeURIComponent(item.created_at)}`
      );
        
      const text = await response.text();
      console.log("Raw response text:", text);
  
    } catch (error) {
      console.error("Error fetching logs via GET:", error);
    }
  };


  useEffect(() => {
    if (userId) {
      fetchCaloLog();
    }
     const delay = setTimeout(() => {
    calculateCalories();
  }, 300); // 300ms delay

  return () => clearTimeout(delay);
  }, [userId]);
  
  const handleReset = async () => {
    await logReset();       // call the API to reset/delete logs
    await fetchCaloLog();   // fetch updated data
  };

    
  const handleRemove = async (item) => {
    await logRemove(item);       // call the API to reset/delete logs
    await fetchCaloLog();   // fetch updated data
  };
  const handleAdd = async () => {
    await calculateCalories(); // calculate calories first
    await caloriesLog();       // call the API to reset/delete logs
    await fetchCaloLog();   // fetch updated data
  };
  
  const caloriesLog = async () => {
    if (!selectedItem || !grams) return;
  
    const calo = calculatedItems.map(item => item.cals); 
    const total = calo.reduce((sum, calo) => sum + Number(calo), 0);
    // Reset previous state
    setFoodItem("");
    setAmountGrams("");
    setItemCalories("");
    setCalculated(null);
  
    try {
      // ✅ 1. First: Calculate calories
      const result = await axios.post("http://localhost/my-app/src/backend/CaloriesCalculator.php", {
        foodItem: selectedItem.FoodItem,
        grams: parseFloat(grams),
      });
  
      console.log("Calculation result:", result.data);
      const { item, quantity, calories } = result.data;
  
      setCalculated(result.data);
      setFoodItem(item);
      setAmountGrams(quantity);
      setItemCalories(calories);
  
      // ✅ 2. Then: Log to database
      const kj = calories * 4.184;
  
      const response = await fetch("http://localhost/my-app/src/backend/caloriesLog.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          food_item: item,
          amount_grams: quantity,
          cals: calories,
          kj: kj,
        }),
      });
  
      const data = await response.json();
      console.log("Calories log saved:", data);
    } catch (error) {
      console.error("Error:", error);
      setCalculated({ error: "Calculation or log failed" });
    }
  };
  

      
  
  
  // Load categories
  useEffect(() => {
    axios.get("http://localhost/my-app/src/backend/CaloriesCalculator_GetCategories.php").then((res) => {
      setCategories(res.data);
    });
  }, []);

  // Fetch filtered items
  useEffect(() => {
    if (selectedCategory || searchTerm) {
      const delay = setTimeout(() => {
        axios
          .get("http://localhost/my-app/src/backend/CaloriesCalculator_GetIteams.php", {
            params: {
              category: selectedCategory,
              search: searchTerm,
            },
          })
          .then((res) => {
            setItems(res.data);
          });
      }, 300); // debounce
      return () => clearTimeout(delay);
    }
  }, [selectedCategory, searchTerm]);

  // Handle calculation
const calculateCalories = () => {
    if (!selectedItem || !grams) return;

    setFoodItem("");
    setAmountGrams("");
    setItemCalories("");
    setCalculated(null);
    axios
        .post("http://localhost/my-app/src/backend/CaloriesCalculator.php", {
            foodItem: selectedItem.FoodItem,
            grams: parseFloat(grams),
        })
        .then((result) => {
          console.log("Calculation result:", result.data);
          setCalculated(result.data);
          
          setFoodItem(result.data.item);
          setAmountGrams(result.data.quantity);
          setItemCalories(result.data.calories);
 

            
        })
        .catch((err) => {
            console.error(err);
            setCalculated({ error: "Calculation failed" });
        });
};


  









    const calo = calculatedItems.map(item => item.cals); 
    const total = calo.reduce((sum, calo) => sum + Number(calo), 0);


  return (
    

    <div className="page-container">

    <Sidebar />
    
    <div className="with-sidebar">
    <div className="mt-6 p-4 border rounded bg-gray-50">
    <h2 className="section-title"> Calories Calculator </h2>

    <div className="p-4 space-y-4">
  <h2 className="text-xl font-bold">Your Log</h2>

  {calculatedItems.length === 0 ? (
    <div className="text-gray-500">No items logged yet.</div>
  ) : (
    <div className="text-gray-500">You have logged {calculatedItems.length} items.</div>
  )}

  <ul className="space-y-3">
    {calculatedItems.map((item) => (
      <li
        key={item.id}
        className="p-4 bg-white border rounded shadow flex flex-col md:flex-row md:justify-between md:items-center gap-3"
      >
<div className="flex-1 transition-all duration-300 hover:filter hover:hue-rotate-60">
          <div><strong>Food:</strong> {item.food_item}</div>
          <div><strong>Amount:</strong> {item.amount_grams} grams</div>
          <div><strong>Calories:</strong> {item.cals} kcal</div>
          <div><strong>Logged At:</strong> {item.created_at}</div>
        </div>
        <button
          onClick={() => handleRemove(item)}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Remove
        </button>
      </li>
    ))}
  </ul>
  <div><strong>Total Calories:</strong> {total} kcal</div>

  <button
    onClick={handleReset}
    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
  >
    Reset
  </button>
</div>

     
<div className="mt-6 p-4 border rounded bg-gray-50">

    </div>


    <div className="p-6 max-w-3xl mx-auto font-sans">

      {/* Category dropdown */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option
         value="">-- Select Category --</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat.FoodCategory}>
            {cat.FoodCategory}
          </option>
        ))}
      </select>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search food..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      {/* Food item results */}
      <div className="space-y-2 mb-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedItem(item)}
            className={`p-3 border rounded cursor-pointer shadow-sm ${
              selectedItem?.FoodItem === item.FoodItem ? "bg-blue-100" : ""
            }`}
          >
            <strong>{item.FoodItem}</strong> - {item.Cals_per100grams} kcal / 100g
          </div>
        ))}
      </div>

      {/* Quantity input */}
      {selectedItem && (
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            Quantity (grams) for: {selectedItem.FoodItem}
          </label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            placeholder="e.g. 150"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
          <button
            onClick={calculateCalories}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Calculate Calories
          </button>
          <button
            onClick={handleAdd}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
         
        </div>
      )}

      {/* Result */}
      {calculated && (
        <div className="p-4 border rounded bg-green-50">
          {calculated.error ? (
            <div className="text-red-600">{calculated.error}</div>
          ) : (
            <>
              <div><strong>Food:</strong> {calculated.item}</div>
              <div><strong>Quantity:</strong> {calculated.quantity} grams</div>
              <div><strong>Total Calories: </strong> {calculated.calories} kcal</div>
              
            </>
          )}
        </div>
      )}
    </div>
    </div>
    </div>
    </div>

  );
};

export default CaloriesCalculator;
