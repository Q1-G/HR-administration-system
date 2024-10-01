"use client";

import { api } from '../../trpc/react'; 
import { useState } from 'react';
import Link from 'next/link'; 


interface Department {
  id: number;
  name: string;
}

interface Manager {
  id: number;
  firstName: string;
  lastName: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  telephone: string;
  email: string;
  status: string;
  employeeManager?: Manager | null; 
  departments: Department[];
}

const EmployeeListView = () => {
  const { data: employees, isLoading: loadingEmployees, error: errorEmployees } = api.employee.getAll.useQuery();
  const { data: departments, isLoading: loadingDepartments, error: errorDepartments } = api.department.getAll.useQuery();
  const { data: managers, isLoading: loadingManagers, error: errorManagers } = api.employee.getManagers.useQuery(); 

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterClicked, setIsFilterClicked] = useState(false);

  // Handle loading and error states
  if (loadingEmployees || loadingDepartments || loadingManagers) return <div>Loading...</div>;
  if (errorEmployees) return <div>Error loading employees: {errorEmployees.message}</div>;
  if (errorDepartments) return <div>Error loading departments: {errorDepartments.message}</div>;
  if (errorManagers) return <div>Error loading managers: {errorManagers.message}</div>;

  // Filter employees based on search and selected filters
  const filteredEmployees: Employee[] = employees?.filter((employee: Employee) => {
    const matchesSearch = employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
                          employee.lastName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All' || employee.departments.some(dept => dept.name === departmentFilter);
    const matchesManager = managerFilter === 'All' || employee.employeeManager?.id === parseInt(managerFilter);

    return matchesSearch && matchesStatus && matchesDepartment && matchesManager;
  }) || []; // Default to an empty array if undefined

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleFilter = () => {
    setIsFilterClicked(true);
    setTimeout(() => setIsFilterClicked(false), 2000);
  };

  const handleStatusChange = (employeeId: number, newStatus: string) => {
    console.log(`Updating employee ${employeeId} to ${newStatus}`);
    // Implement API call to update the status here
  };

  return (
    <div className="min-h-screen bg-white p-8 xl:px-64 lg:px-48">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-blue-600">Employees</h1>
      </div>

      {/* Filters for status, department, and manager */}
      <div className="bg-white border border-blue-600 p-4 rounded shadow-lg mb-4">
        <h2 className="text-xl font-bold mb-2 text-black">Filters</h2>
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex items-center">
            <label className="text-black font-bold w-32">Status</label>
            <select
              className="bg-white border border-blue-600 text-black p-2 rounded w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="flex items-center">
            <label className="text-black font-bold w-32">Department</label>
            <select
              className="bg-white border border-blue-600 text-black p-2 rounded w-full"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="All">All</option>
              {departments?.map((department: Department) => (
                <option key={department.id} value={department.name}>{department.name}</option>
              ))}
            </select>
          </div>

          {/* Manager Filter */}
          <div className="flex items-center">
            <label className="text-black font-bold w-32">Manager</label>
            <select
              className="bg-white border border-blue-600 text-black p-2 rounded w-full"
              value={managerFilter}
              onChange={(e) => setManagerFilter(e.target.value)}
            >
              <option value="All">All</option>
              {managers?.map((manager: Manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.firstName} {manager.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className={`mt-4 px-4 py-2 font-bold text-white rounded ${isFilterClicked ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
          onClick={handleFilter}
        >
          Filter
        </button>
      </div>

      {/* Pagination and search bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <label className="text-black">Show per page:</label>
          <select
            className="bg-white border border-blue-600 text-black p-2 rounded"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value="All">All</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search employees..."
          className="bg-white border border-blue-600 text-black p-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Employee Table */}
      <table className="table-auto bg-white border border-blue-600 text-black w-full rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-4">Actions</th>
            <th className="p-4">First Name</th>
            <th className="p-4">Last Name</th>
            <th className="p-4">Telephone</th>
            <th className="p-4">Email</th>
            <th className="p-4">Manager</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedEmployees.map((employee: Employee) => (
            <tr key={employee.id} className="border-t border-gray-300">
              <td className="p-4">
                <Link href={`/employees/edit/${employee.id}`}>
                  <button className="bg-blue-600 text-white p-2 rounded mr-2">Edit</button>
                </Link>
                {employee.status === "Active" ? (
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => handleStatusChange(employee.id, 'Inactive')}
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    className="bg-green-500 text-white p-2 rounded"
                    onClick={() => handleStatusChange(employee.id, 'Active')}
                  >
                    Activate
                  </button>
                )}
              </td>
              <td className="p-4">{employee.firstName}</td>
              <td className="p-4">{employee.lastName}</td>
              <td className="p-4">{employee.telephone}</td>
              <td className="p-4">{employee.email}</td>
              <td className="p-4">{employee.employeeManager?.firstName ?? "None"}</td>
              <td className="p-4">{employee.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between">
        <div className="text-black">
          Showing {paginatedEmployees.length} of {filteredEmployees.length} employees
        </div>
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-4 py-2 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeListView;