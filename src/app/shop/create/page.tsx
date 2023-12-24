import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
  return (
    <Card className="mx-auto w-full max-w-2xl shadow-md">
      <CardHeader>
        <CardTitle>Create Your Shop</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="mt-6">
          <div className="mb-6 flex flex-wrap">
            <Label className="mb-2 block w-full text-sm font-bold text-gray-700">
              Shop Name
              <Input
                // className="form-input mt-1 block w-full rounded-md bg-gray-200 px-4 py-3 focus:bg-white"
                placeholder="Enter shop name"
                type="text"
              />
            </Label>
          </div>
          <div className="mb-6 flex flex-wrap">
            <Label className="mb-2 block w-full text-sm font-bold text-gray-700">
              Shop Image
              <Input type="file" />
            </Label>
          </div>
          <div className="mb-6 flex flex-wrap">
            <Label className="mb-2 block w-full text-sm font-bold text-gray-700">
              Location
              <Input placeholder="Enter location" type="text" />
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <Button>Create Shop</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
