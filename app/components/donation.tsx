import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Checkbox } from "~/components/ui/checkbox";
import { Heart, CreditCard } from "lucide-react";
import { Form, json, useFetcher } from "@remix-run/react";
import { TokenPayload } from "~/types/Token";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignTitle: string;
}

export function DonationModal({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
}: DonationModalProps) {
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const predefinedAmounts = ["25", "50", "100", "250", "custom"];

  const fetcher = useFetcher();

  const handleDonate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);

    const formdata = new FormData();

    formdata.append("id", campaignId);
    formdata.append("amount", amount != "custom" ? amount : customAmount);
    formdata.append("intent", "donate");
    fetcher.submit(formdata, {
      method: "post",
      action: `/campaign/${campaignId}`,
    });

    setIsProcessing(false);
    onClose();
    return json({ message: "donation succesfull" });
  };

  const selectedAmount = amount === "custom" ? customAmount : amount;

  return (
    <Form method="POST" onSubmit={handleDonate}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Make a Donation</span>
            </DialogTitle>
            <DialogDescription>Support {campaignTitle}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Amount Selection */}
            <div className="space-y-3">
              <Label>Donation Amount ($)</Label>
              <RadioGroup value={amount} onValueChange={setAmount}>
                <div className="grid grid-cols-2 gap-3">
                  {predefinedAmounts.map((amt) => (
                    <div key={amt} className="flex items-center space-x-2">
                      <RadioGroupItem value={amt} id={amt} />
                      <Label htmlFor={amt} className="cursor-pointer">
                        {amt === "custom" ? "Custom" : `$${amt}`}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>

              {amount === "custom" && (
                <Input
                  type="number"
                  placeholder="Enter custom amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Leave a message of support..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
              <Label htmlFor="anonymous" className="text-sm">
                Donate anonymously
              </Label>
            </div>

            {/* Total */}
            {selectedAmount && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Donation:</span>
                  <span className="text-xl font-bold">${selectedAmount}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDonate}
                disabled={!selectedAmount || isProcessing}
                className="flex-1"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isProcessing ? "Processing..." : "Donate Now"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
