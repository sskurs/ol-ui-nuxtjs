import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EarningRule {
  id: number;
  name: string;
  isActive: boolean;
  ruleJson: string;
}

interface RuleCondition {
  field: string;
  operator: string;
  value: string;
}

interface RuleAction {
  points: number;
}

interface RuleForm {
  name: string;
  condition: RuleCondition;
  action: RuleAction;
  isActive: boolean;
}

export default function EarningRules() {
  const { toast } = useToast();
  const [rules, setRules] = useState<EarningRule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<EarningRule | null>(null);
  const [formData, setFormData] = useState<RuleForm>({
    name: "",
    condition: {
      field: "PurchaseAmount",
      operator: ">",
      value: "",
    },
    action: {
      points: 0,
    },
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      condition: {
        field: "PurchaseAmount",
        operator: ">",
        value: "",
      },
      action: {
        points: 0,
      },
      isActive: true,
    });
    setEditingRule(null);
  };

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/earning-rules", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error("Failed to fetch rules:", error);
      toast({
        title: "Error",
        description: "Failed to fetch earning rules",
        variant: "destructive",
      });
    }
  };

  const handleEditRule = (rule: EarningRule) => {
    try {
      const ruleData = JSON.parse(rule.ruleJson);
      const ruleExpression = ruleData.Rules[0].Expression;
      const pointsExpression = ruleData.Rules[0].Actions.OnSuccess.Context.Expression;
      
      // Parse expression like "input1.PurchaseAmount > 5000"
      let match = ruleExpression.match(/input1\.(\w+)\s*([><=]+)\s*(\d+)/);
      if (!match) {
        // Fallback for old "input." format if needed, or just error out
        const oldMatch = ruleExpression.match(/input\.(\w+)\s*([><=]+)\s*(\d+)/);
        if(!oldMatch){
          throw new Error("Invalid rule expression format. Expected format like 'input1.FieldName > 100'");
        }
        match = oldMatch;
      }
      
      const [_, field, operator, value] = match;
      
      setFormData({
        name: rule.name,
        condition: {
          field,
          operator,
          value,
        },
        action: {
          points: parseInt(pointsExpression),
        },
        isActive: rule.isActive,
      });
      
      setEditingRule(rule);
      setIsCreating(true);
    } catch (error) {
      console.error("Failed to parse rule:", error);
      toast({
        title: "Error",
        description: "Failed to parse rule data",
        variant: "destructive",
      });
    }
  };

  const handleSaveRule = async () => {
    const ruleJson = {
      WorkflowName: formData.name.replace(/\s+/g, ''),
      Rules: [
        {
          RuleName: formData.name,
          ErrorMessage: `Condition not met for ${formData.name}`,
          ErrorType: "Error",
          RuleExpressionType: "LambdaExpression",
          Expression: `input1.${formData.condition.field} ${formData.condition.operator} ${formData.condition.value}`,
          Actions: {
            OnSuccess: {
              Name: "Evaluate",
              Context: { Expression: formData.action.points.toString() }
            }
          }
        }
      ]
    };

    try {
      const token = localStorage.getItem("token");
      const url = editingRule 
        ? `http://localhost:5000/api/earning-rules/${editingRule.id}`
        : "http://localhost:5000/api/earning-rules";
        
      const method = editingRule ? "PUT" : "POST";

      const payload = {
        Name: formData.name,
        RuleJson: JSON.stringify(ruleJson), // always send as string
        IsActive: formData.isActive,
      };
      
      console.log("🔼 Sending payload:", payload);

      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
        console.error("❌ Backend error:", errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setIsCreating(false);
      resetForm();
      fetchRules();
      
      toast({
        title: "Success",
        description: `Rule ${editingRule ? "updated" : "created"} successfully`,
      });
    } catch (error) {
      console.error("Failed to save rule:", error);
      toast({
        title: "Error",
        description: `Failed to ${editingRule ? "update" : "create"} rule`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteRule = async (ruleId: number) => {
    if (!confirm("Are you sure you want to delete this rule?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/earning-rules/${ruleId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchRules();
      toast({
        title: "Success",
        description: "Rule deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete rule",
        variant: "destructive",
      });
    }
  };

  const toggleRuleStatus = async (ruleId: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/earning-rules/${ruleId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchRules();
      toast({
        title: "Success",
        description: `Rule ${isActive ? "activated" : "deactivated"} successfully`,
      });
    } catch (error) {
      console.error("Failed to update rule status:", error);
      toast({
        title: "Error",
        description: "Failed to update rule status",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const formatRuleDescription = (ruleJson: string) => {
    try {
      const data = JSON.parse(ruleJson);
      const rule = data.Rules[0];
      const points = rule.Actions.OnSuccess.Context.Expression;
      return `Award ${points} points when ${rule.Expression.replace('input.', '')}`;
    } catch {
      return "Invalid rule format";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Earning Rules</h2>
        <Button onClick={() => setIsCreating(true)}>Create New Rule</Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRule ? "Edit Rule" : "Create New Rule"}</CardTitle>
            <CardDescription>
              Define conditions and rewards for earning points
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label>Rule Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter rule name"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Field</Label>
                  <Select
                    value={formData.condition.field}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        condition: { ...formData.condition, field: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PurchaseAmount">Purchase Amount</SelectItem>
                      <SelectItem value="TransactionCount">Transaction Count</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Operator</Label>
                  <Select
                    value={formData.condition.operator}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        condition: { ...formData.condition, operator: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=">">Greater than</SelectItem>
                      <SelectItem value=">=">Greater than or equal</SelectItem>
                      <SelectItem value="<">Less than</SelectItem>
                      <SelectItem value="<=">Less than or equal</SelectItem>
                      <SelectItem value="==">Equal to</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Value</Label>
                  <Input
                    type="number"
                    value={formData.condition.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        condition: { ...formData.condition, value: e.target.value },
                      })
                    }
                    placeholder="Enter value"
                  />
                </div>
              </div>

              <div>
                <Label>Points to Award</Label>
                <Input
                  type="number"
                  value={formData.action.points}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      action: { points: parseInt(e.target.value) || 0 },
                    })
                  }
                  placeholder="Enter points"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label>Active</Label>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSaveRule}>
                  {editingRule ? "Update Rule" : "Save Rule"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {rule.name}
                    <Badge variant={rule.isActive ? "default" : "secondary"}>
                      {rule.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {formatRuleDescription(rule.ruleJson)}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditRule(rule)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={(checked) =>
                      toggleRuleStatus(rule.id, checked)
                    }
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
} 