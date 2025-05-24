import { useState, useEffect } from 'react';

interface PointageRecord {
  ip: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  timestamp: string;
  type: 'entree' | 'sortie';
  token: string;
}

const Admin = () => {
  const [pointageRecords, setPointageRecords] = useState<PointageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Récupérer toutes les entrées de pointage du localStorage
    const fetchPointageRecords = () => {
      const records: PointageRecord[] = [];
      
      // Parcourir toutes les clés du localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Vérifier si la clé correspond à un enregistrement de pointage
        if (key && key.startsWith('pointage-QR-')) {
          try {
            const recordData = localStorage.getItem(key);
            if (recordData) {
              const record = JSON.parse(recordData) as PointageRecord;
              records.push(record);
            }
          } catch (error) {
            console.error('Erreur lors de la lecture des données:', error);
          }
        }
      }
      
      // Trier les enregistrements par date (du plus récent au plus ancien)
      records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setPointageRecords(records);
      setLoading(false);
    };
    
    fetchPointageRecords();
    
    // Mettre à jour les données toutes les 30 secondes
    const interval = setInterval(fetchPointageRecords, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Ces fonctions sont utilisées directement dans le rendu
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img 
              src="/images/logo-mairie.png" 
              alt="Logo Mairie de Noisy-le-Sec" 
              className="h-16 mr-4"
            />
            <h1 className="text-2xl font-bold text-blue-800">
              Administration du Système de Pointage
            </h1>
          </div>
          <a href="/" className="text-blue-600 hover:text-blue-800">
            Retour à l'accueil
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Tableau des Pointages
          </h2>
          
          {loading ? (
            <div className="text-center p-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Chargement des données...</p>
            </div>
          ) : pointageRecords.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-700">Aucun pointage enregistré pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800">Date</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800">Heure</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800">Type</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800">IP</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-blue-800">Adresse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pointageRecords.map((record, index) => {
                    const dateTime = new Date(record.timestamp);
                    const formattedDate = new Intl.DateTimeFormat('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }).format(dateTime);
                    
                    const formattedTime = new Intl.DateTimeFormat('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    }).format(dateTime);
                    
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-3 px-4 text-sm text-gray-700">{formattedDate}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{formattedTime}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            record.type === 'entree' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {record.type === 'entree' ? 'Entrée' : 'Sortie'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{record.ip}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 truncate max-w-xs">
                          {record.address}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Statistiques
          </h2>
          
          {loading ? (
            <div className="text-center p-4">
              <p className="text-gray-600">Chargement des statistiques...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600">Total des pointages</p>
                <p className="text-2xl font-bold text-blue-800">{pointageRecords.length}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-sm text-gray-600">Entrées</p>
                <p className="text-2xl font-bold text-green-800">
                  {pointageRecords.filter(r => r.type === 'entree').length}
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <p className="text-sm text-gray-600">Sorties</p>
                <p className="text-2xl font-bold text-red-800">
                  {pointageRecords.filter(r => r.type === 'sortie').length}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <p className="text-sm text-gray-600">Adresses IP uniques</p>
                <p className="text-2xl font-bold text-purple-800">
                  {new Set(pointageRecords.map(r => r.ip)).size}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} - Ville de Noisy-le-Sec - Tous droits réservés
      </div>
    </div>
  );
};

export default Admin;
