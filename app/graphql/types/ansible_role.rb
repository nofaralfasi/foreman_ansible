module Types
  class AnsibleRole < BaseObject
    description 'Ansible role'

    global_id_field :id

    field :name, String, :null => false
  end
end