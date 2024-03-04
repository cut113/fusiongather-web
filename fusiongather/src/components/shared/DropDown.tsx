import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategory } from "@/lib/actions/event"; // Thay đường dẫn đến hàm getAllCategory ở đây

type DropDownProps = {
  value?: string;
  onChangeHandler?: (selectedValue: string) => void; 
};


function DropDown({ value,onChangeHandler }: DropDownProps) {
  const [categories, setCategories] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCategory();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchData();
  }, []);

   const onValueChangeHandler = (selectedValue: string) => {
    setSelectedCategory(selectedValue);
    if (onChangeHandler) {
      onChangeHandler(selectedValue);
    }
  };
  // const onChangeHandler = (selectedValue: string) => {
  //   setSelectedCategory(selectedValue);
  // };


  return (
    <Select onValueChange={onValueChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field h-14 text-[18px] text-secondary rounded-2xl">
        <SelectValue placeholder="Choose..." selected={selectedCategory} />
      </SelectTrigger>
      <SelectContent>
        {categories.map((category:any) => (
          <SelectItem key={category.id} value={category.categoryName}>
            {category.categoryName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default DropDown;


