"use client";
import axios from 'axios';

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function MyBatches() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8090/api/batches')
      .then((response) => {
        setBatches(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch batches');
        setLoading(false);
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (user === undefined) return; // Wait until user is loaded

    if (!user?.token) {
      console.warn("Redirecting to login because token is missing");
      // router.push("/login");
      return;
    }

    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/batches", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch batches");
        }
        const data = await response.json();
        setBatches(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, [user, router]);

  if (user === undefined || role === undefined) return <div>Loading user data...</div>;
  if (role !== "lecturer") return <div>Access Denied</div>;
  if (loading) return <div>Loading batches...</div>;
  if (error) return <div>Error: {error}</div>;

  const getBatchStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "upcoming":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Batches</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-500" />
            My Batches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{batch.name}</h3>
                    <p className="text-sm text-gray-500">
                      {batch.start_date} to {batch.end_date}
                    </p>
                  </div>
                  <Badge className={getBatchStatusColor(batch.status)}>
                    {batch.status.charAt(0).toUpperCase() +
                      batch.status.slice(1).replace("-", " ")}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{batch.progress}%</span>
                  </div>
                  <Progress value={batch.progress} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Students: {batch.students}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto"
                      onClick={() => setSelectedBatch(batch)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedBatch}
        onOpenChange={(open) => !open && setSelectedBatch(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Batch Details</DialogTitle>
            <DialogDescription>
              Information about {selectedBatch?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Batch Name</p>
                  <p>{selectedBatch.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getBatchStatusColor(selectedBatch.status)}>
                    {selectedBatch.status.charAt(0).toUpperCase() +
                      selectedBatch.status.slice(1).replace("-", " ")}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p>{selectedBatch.start_date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p>{selectedBatch.end_date}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Progress</p>
                <div className="flex items-center space-x-2">
                  <Progress value={selectedBatch.progress} className="h-2 flex-1" />
                  <span className="text-sm">{selectedBatch.progress}%</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Students</p>
                <p>{selectedBatch.students} students enrolled</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
