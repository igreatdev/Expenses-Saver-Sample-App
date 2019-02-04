<?php
namespace App\Controller\Api;

use App\Controller\Api\AppController;

/**
 * Expenses Controller
 *
 * @property \App\Model\Table\ExpensesTable $Expenses
 *
 * @method \App\Model\Entity\Expense[]|\Cake\Datasource\ResultSetInterface paginate($object = null, array $settings = [])
 */
class ExpensesController extends AppController
{

    /**
     * Index method
     *
     * @return \Cake\Http\Response|void
     */
    public function index()
    {
        $expenses = $this->paginate($this->Expenses->find()->order(['expense_date'=>'Desc']));

        $this->set([
            'status' => 'Ok',
            'data' => $expenses,
            '_serialize' => ['status','data']
        ]);
    }

    /**
     * View method
     *
     * @param string|null $id Expense id.
     * @return \Cake\Http\Response|void
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($id = null)
    {
        $expense = $this->Expenses->get($id, [
            'contain' => []
        ]);

        $this->set([
            'status' => 'Ok',
            'data' => $expense,
            '_serialize' => ['status','data']
        ]);
    }

    /**
     * Add method
     *
     * @return \Cake\Http\Response|null Redirects on successful add, renders view otherwise.
     */
    public function add()
    {
        $expense = $this->Expenses->newEntity();
        if ($this->request->is('post')) {
            $expense = $this->Expenses->patchEntity($expense, $this->request->getData());
            if ($expense = $this->Expenses->save($expense)) {
                // $this->Flash->success(__('The expense has been saved.'));
                $this->set([
                    'status' => 'Ok',
                    '_serialize' => ['status']
                ]);

                return;
            }
            // $this->Flash->error(__('The expense could not be saved. Please, try again.'));
            $this->set([
                'status' => 'error',
                'message' => 'The data could not be saved',
                'errors' => $expense->getErrors(),
                '_serialize' => ['status','message','errors']
            ]);
        }
        // $this->set(compact('expense'));
    }

    /**
     * Edit method
     *
     * @param string|null $id Expense id.
     * @return \Cake\Http\Response|null Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function edit($id = null)
    {
        $expense = $this->Expenses->get($id, [
            'contain' => []
        ]);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $expense = $this->Expenses->patchEntity($expense, $this->request->getData());
            if ($expense = $this->Expenses->save($expense)) {
                // $this->Flash->success(__('The expense has been saved.'));
                $this->set([
                    'status' => 'Ok',
                    '_serialize' => ['status']
                ]);

                return;
            }
            // $this->Flash->error(__('The expense could not be saved. Please, try again.'));
            $this->set([
                'status' => 'error',
                'message' => 'The data could not be saved',
                'errors' => $expense->getErrors(),
                '_serialize' => ['status','message','errors']
            ]);
        }
        // $this->set(compact('expense'));
    }

    /**
     * Delete method
     *
     * @param string|null $id Expense id.
     * @return \Cake\Http\Response|null Redirects to index.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $expense = $this->Expenses->get($id);
        if ($expense = $this->Expenses->delete($expense)) {
            // $this->Flash->success(__('The expense has been deleted.'));
            $this->set([
                'status' => 'Ok',
                '_serialize' => ['status']
            ]);
        } else {
            // $this->Flash->error(__('The expense could not be deleted. Please, try again.'));
            $this->set([
                'status' => 'error',
                'message' => 'The data could not be deleted',
                'errors' => $expense->getErrors(),
                '_serialize' => ['status','message','errors']
            ]);
        }

        // return $this->redirect(['action' => 'index']);
    }
}
