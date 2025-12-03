import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho form thêm học sinh (theo ví dụ)
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // State cho chế độ chỉnh sửa
  const [editingId, setEditingId] = useState(null);
  
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");
  
  // State cho sắp xếp
  const [sortAsc, setSortAsc] = useState(true);

  // Fetch danh sách học sinh khi component load
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students');
      setStudents(response.data);
      setLoading(false);
    } catch (err) {
      setError('Lỗi khi tải danh sách học sinh');
      setLoading(false);
      console.error('Error fetching students:', err);
    }
  };

  // Xử lý submit form (Thêm hoặc Sửa)
  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!name || !age || !stuClass) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // Chế độ chỉnh sửa - gọi API PUT
        const response = await axios.put(`http://localhost:5000/api/students/${editingId}`, {
          name: name,
          age: parseInt(age),
          class: stuClass
        });
        
        // Cập nhật học sinh trong danh sách
        setStudents(prev => prev.map(student => 
          student._id === editingId ? response.data : student
        ));
        
        alert('Cập nhật học sinh thành công!');
        setEditingId(null);
      } else {
        // Chế độ thêm mới - gọi API POST
        const response = await axios.post('http://localhost:5000/api/students', {
          name: name,
          age: parseInt(age),
          class: stuClass
        });
        
        // Thêm học sinh mới vào danh sách
        setStudents(prev => [...prev, response.data]);
        
        alert('Thêm học sinh thành công!');
      }
      
      // Reset form
      setName("");
      setAge("");
      setStuClass("");
      
    } catch (err) {
      console.error('Error:', err);
      alert(editingId ? 'Lỗi khi cập nhật học sinh!' : 'Lỗi khi thêm học sinh!');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Xử lý khi bấm nút Sửa
  const handleEdit = (student) => {
    setEditingId(student._id);
    setName(student.name);
    setAge(student.age.toString());
    setStuClass(student.class);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setAge("");
    setStuClass("");
  };
  
  // Xử lý xóa học sinh
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;
    
    try {
      const response = await axios.delete(`http://localhost:5000/api/students/${id}`);
      console.log(response.data.message);
      
      // Xóa học sinh khỏi danh sách
      setStudents(prevList => prevList.filter(s => s._id !== id));
      
      // Nếu đang sửa học sinh này thì hủy chế độ edit
      if (editingId === id) {
        handleCancelEdit();
      }
      
      alert('Xóa học sinh thành công!');
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert('Lỗi khi xóa học sinh!');
    }
  };

  // Lọc danh sách học sinh dựa trên searchTerm
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sắp xếp danh sách đã lọc theo tên
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Quản Lý Học Sinh</h1>
      
      {/* Form thêm/sửa học sinh */}
      <div className="form-container">
        <h2>{editingId ? 'Chỉnh Sửa Học Sinh' : 'Thêm Học Sinh Mới'}</h2>
        {editingId && (
          <p className="edit-notice">Đang chỉnh sửa học sinh. <button type="button" onClick={handleCancelEdit} className="btn-cancel">Hủy</button></p>
        )}
        <form onSubmit={handleAddStudent} className="student-form">
          <div className="form-group">
            <label htmlFor="name">Họ và Tên:</label>
            <input
              type="text"
              id="name"
              placeholder="Họ tên"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">Tuổi:</label>
            <input
              type="number"
              id="age"
              placeholder="Tuổi"
              value={age}
              onChange={e => setAge(e.target.value)}
              required
              min="1"
              max="100"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="class">Lớp:</label>
            <input
              type="text"
              id="class"
              placeholder="Lớp"
              value={stuClass}
              onChange={e => setStuClass(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting 
              ? (editingId ? 'Đang cập nhật...' : 'Đang thêm...') 
              : (editingId ? 'Cập nhật học sinh' : 'Thêm học sinh')
            }
          </button>
        </form>
      </div>

      {/* Danh sách học sinh */}
      <div className="table-container">
        <h2>Danh Sách Học Sinh</h2>
        
        {/* Thanh công cụ: Tìm kiếm và Sắp xếp */}
        <div className="toolbar">
          {/* Ô tìm kiếm */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")} 
                className="btn-clear-search"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* Nút sắp xếp */}
          <button 
            onClick={() => setSortAsc(prev => !prev)}
            className="btn-sort"
            title="Đổi thứ tự sắp xếp"
          >
            <span className="sort-icon">{sortAsc ? '↓' : '↑'}</span>
            Sắp xếp theo tên: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>
        
        {students.length === 0 ? (
          <p className="no-data">Chưa có học sinh nào trong danh sách.</p>
        ) : sortedStudents.length === 0 ? (
          <p className="no-data">Không tìm thấy học sinh nào phù hợp với "{searchTerm}".</p>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ và Tên</th>
                <th>Tuổi</th>
                <th>Lớp</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((student, index) => (
                <tr key={student._id} className={editingId === student._id ? 'editing-row' : ''}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.class}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(student)} 
                      className="btn-edit"
                      disabled={submitting}
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(student._id)} 
                      className="btn-delete"
                      disabled={submitting}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
