import { Card, CardHeader, Checkbox, Button } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'

/**
 * Step 5: Functionality issues (checkboxes)
 * User marks what DOESN'T work
 * If nothing is checked = everything works fine
 */
export function StepFunctionality() {
  const { state, setFunctionality, nextStep } = useWizard()
  const { functionalityIssues } = state

  return (
    <Card>
      <CardHeader
        title="¿Hay algo que no funcione?"
        subtitle="Marcá solo lo que tenga problemas. Si todo funciona bien, dejá todo sin marcar."
      />
      <div className="grid gap-3 mb-6">
        <Checkbox
          label="Face ID no funciona"
          description="No reconoce tu cara o da error"
          checked={functionalityIssues.faceId}
          onChange={(checked) => setFunctionality({ faceId: checked })}
        />
        <Checkbox
          label="Cámara con problemas"
          description="Alguna cámara no funciona o tiene manchas"
          checked={functionalityIssues.camera}
          onChange={(checked) => setFunctionality({ camera: checked })}
        />
        <Checkbox
          label="Audio con problemas"
          description="Micrófono o parlantes no funcionan bien"
          checked={functionalityIssues.audio}
          onChange={(checked) => setFunctionality({ audio: checked })}
        />
      </div>
      <Button onClick={nextStep} fullWidth>
        Continuar
      </Button>
    </Card>
  )
}
