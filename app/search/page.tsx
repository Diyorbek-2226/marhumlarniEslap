import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const Search = () => {
    return (
       <div className="w-4/5 mx-auto mt-12">
         <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
      
       </div>
    );
}

export default Search;
