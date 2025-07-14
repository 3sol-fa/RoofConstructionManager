import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Material } from '@shared/schema';

export default function Materials() {
  const { data: materials, isLoading } = useQuery<Material[]>({
    queryKey: ['/api/materials'],
  });

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) {
      return { label: 'Low Stock', color: 'bg-red-900 text-red-300' };
    } else if (current <= min * 1.5) {
      return { label: 'Running Low', color: 'bg-yellow-900 text-yellow-300' };
    } else {
      return { label: 'In Stock', color: 'bg-green-900 text-green-300' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header title="Materials" />
        <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-32 bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header title="Materials" />
      
      <main className="flex-1 overflow-y-auto bg-gray-900 p-4 pb-20 md:pb-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Materials Inventory</h1>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <i className="fas fa-download mr-2"></i>
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <i className="fas fa-plus mr-2"></i>
              Add Material
            </Button>
          </div>
        </div>

        {materials?.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <i className="fas fa-warehouse text-6xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-semibold text-white mb-2">No materials in inventory</h3>
              <p className="text-gray-400 mb-6">Add materials to start tracking your inventory</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <i className="fas fa-plus mr-2"></i>
                Add First Material
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Inventory Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white">{materials?.length || 0}</div>
                  <div className="text-sm text-gray-400">Total Items</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {materials?.filter(m => (m.currentStock || 0) <= (m.minStock || 0)).length || 0}
                  </div>
                  <div className="text-sm text-gray-400">Low Stock</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {materials?.filter(m => (m.currentStock || 0) > (m.minStock || 0)).length || 0}
                  </div>
                  <div className="text-sm text-gray-400">In Stock</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    ${materials?.reduce((total, m) => total + (parseFloat(m.costPerUnit || '0') * (m.currentStock || 0)), 0).toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-gray-400">Total Value</div>
                </CardContent>
              </Card>
            </div>

            {/* Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials?.map((material) => {
                const stockStatus = getStockStatus(material.currentStock || 0, material.minStock || 0);
                const totalValue = parseFloat(material.costPerUnit || '0') * (material.currentStock || 0);
                
                return (
                  <Card key={material.id} className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold text-white">
                          {material.name}
                        </CardTitle>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 text-sm mb-4">
                        {material.description || 'No description available'}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Current Stock:</span>
                          <span className="text-white font-semibold">
                            {material.currentStock || 0} {material.unit}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Min Stock:</span>
                          <span className="text-white">
                            {material.minStock || 0} {material.unit}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Unit Cost:</span>
                          <span className="text-white">
                            ${parseFloat(material.costPerUnit || '0').toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Value:</span>
                          <span className="text-white font-semibold">
                            ${totalValue.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                          <i className="fas fa-edit mr-1"></i>
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                          <i className="fas fa-plus mr-1"></i>
                          Restock
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
