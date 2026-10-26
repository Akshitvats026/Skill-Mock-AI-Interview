const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'skill_mock_data')
  : path.join(__dirname, '../../data');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Directory create fallback:', e.message);
}

class StorageService {
  constructor(collectionName) {
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.collectionName = collectionName;
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf8');
    }
  }

  _read() {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data || '[]');
    } catch (err) {
      console.error(`Error reading ${this.collectionName}:`, err);
      return [];
    }
  }

  _write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error(`Error writing ${this.collectionName}:`, err);
    }
  }

  async find(query = {}) {
    const items = this._read();
    return items.filter(item => {
      for (const key of Object.keys(query)) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  }

  async findOne(query = {}) {
    const items = this._read();
    return items.find(item => {
      for (const key of Object.keys(query)) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    }) || null;
  }

  async findById(id) {
    const items = this._read();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async create(data) {
    const items = this._read();
    const newItem = {
      _id: data._id || `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    items.unshift(newItem);
    this._write(items);
    return newItem;
  }

  async findByIdAndUpdate(id, updateData) {
    const items = this._read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    this._write(items);
    return items[index];
  }

  async deleteById(id) {
    let items = this._read();
    const filtered = items.filter(item => item._id !== id && item.id !== id);
    this._write(filtered);
    return true;
  }
}

module.exports = {
  usersStore: new StorageService('users'),
  interviewsStore: new StorageService('interviews'),
  resumesStore: new StorageService('resumes'),
  StorageService
};
